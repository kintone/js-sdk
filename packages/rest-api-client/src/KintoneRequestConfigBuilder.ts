import FormData from "form-data";
import qs from "qs";
import { Base64 } from "js-base64";

import type {
  RequestConfigBuilder,
  RequestConfig,
  HttpMethod,
  Params,
  ProxyConfig,
} from "./http/HttpClientInterface";
import type { BasicAuth, DiscriminatedAuth } from "./types/auth";
import { platformDeps } from "./platform/";
import type { Agent as HttpsAgent } from "https";

type Data = Params | FormData;

const DEFAULT_PROXY_PROTOCOL = "http";

type KintoneAuthHeader =
  | {
      "X-Cybozu-Authorization": string;
      Authorization?: string;
    }
  | {
      "X-Cybozu-API-Token": string;
      Authorization?: string;
    }
  | {
      "X-Requested-With": "XMLHttpRequest";
      Authorization?: string;
    }
  | {
      Authorization: string;
    };

type Options = {
  baseUrl: string;
  auth: DiscriminatedAuth;
  basicAuth?: BasicAuth;
  proxy?: ProxyConfig;
  httpsAgent?: HttpsAgent;
  clientCertAuth?:
    | {
        pfx: Buffer;
        password: string;
      }
    | {
        pfxFilePath: string;
        password: string;
      };
  userAgent?: string;
  socketTimeout?: number;
};

const THRESHOLD_AVOID_REQUEST_URL_TOO_LARGE = 4096;

export class KintoneRequestConfigBuilder implements RequestConfigBuilder {
  private readonly baseUrl: string;
  private readonly headers: KintoneAuthHeader;
  private readonly auth: DiscriminatedAuth;
  private readonly httpsAgent?: HttpsAgent;
  private readonly clientCertAuth?:
    | {
        pfx: Buffer;
        password: string;
      }
    | {
        pfxFilePath: string;
        password: string;
      };
  private readonly proxy?: ProxyConfig;
  private readonly socketTimeout?: number;
  private requestToken: string | null;

  constructor(options: Options) {
    this.baseUrl = options.baseUrl;
    this.auth = options.auth;
    this.headers = this.buildHeaders({
      basicAuth: options.basicAuth,
      userAgent: options.userAgent,
    });
    if ("httpsAgent" in options) {
      if ("clientCertAuth" in options) {
        throw new Error("Cannot specify clientCertAuth along with httpsAgent.");
      }
      this.httpsAgent = options.httpsAgent;
    } else if ("clientCertAuth" in options) {
      this.clientCertAuth = options.clientCertAuth;
    }

    this.proxy = options.proxy;
    this.requestToken = null;
    this.socketTimeout = options.socketTimeout;
  }

  public async build(
    method: HttpMethod,
    path: string,
    params: Data,
    options?: { responseType: "arraybuffer" }
  ) {
    const requestConfig: RequestConfig = {
      method,
      headers: this.headers,
      url: `${this.baseUrl}${path}`,
      ...(options ? options : {}),
      ...platformDeps.buildPlatformDependentConfig({
        httpsAgent: this.httpsAgent,
        clientCertAuth: this.clientCertAuth,
        socketTimeout: this.socketTimeout,
      }),
      proxy: this.buildProxyConfig(this.proxy),
    };

    switch (method) {
      case "get": {
        const requestUrl = this.buildRequestUrl(path, params);
        if (requestUrl.length > THRESHOLD_AVOID_REQUEST_URL_TOO_LARGE) {
          return {
            ...requestConfig,
            method: "post" as const,
            headers: { ...this.headers, "X-HTTP-Method-Override": "GET" },
            data: await this.buildData(params),
          };
        }
        return {
          ...requestConfig,
          url: requestUrl,
        };
      }
      case "post": {
        if (params instanceof FormData) {
          const formData = await this.buildData(params);
          return {
            ...requestConfig,
            headers:
              // NOTE: formData.getHeaders does not exist in a browser environment.
              typeof formData.getHeaders === "function"
                ? { ...this.headers, ...formData.getHeaders() }
                : this.headers,
            data: formData,
          };
        }
        return {
          ...requestConfig,
          data: await this.buildData(params),
        };
      }
      case "put": {
        return {
          ...requestConfig,
          data: await this.buildData(params),
        };
      }
      case "delete": {
        const requestUrl = this.buildRequestUrl(
          path,
          await this.buildData(params)
        );
        return {
          ...requestConfig,
          url: requestUrl,
        };
      }
      default: {
        throw new Error(`${method} method is not supported`);
      }
    }
  }

  private buildProxyConfig(proxyConfig?: ProxyConfig): ProxyConfig | undefined {
    if (proxyConfig === undefined) {
      return undefined;
    }

    if (proxyConfig === false) {
      return false;
    }

    const proxy = proxyConfig;
    if (
      proxy.auth &&
      (proxy.auth.username.length === 0 || proxy.auth.password.length === 0)
    ) {
      proxy.auth = undefined;
    }

    proxy.protocol = proxy.protocol ?? DEFAULT_PROXY_PROTOCOL;

    return proxy;
  }

  private buildRequestUrl(path: string, params: Data): string {
    return `${this.baseUrl}${path}?${qs.stringify(params)}`;
  }

  private async buildData<T extends Data>(params: T): Promise<T> {
    if (this.auth.type === "session") {
      const requestToken = await this.getRequestToken();
      if (params instanceof FormData) {
        params.append("__REQUEST_TOKEN__", requestToken);
        return params;
      }
      return {
        __REQUEST_TOKEN__: requestToken,
        ...params,
      };
    }
    return params;
  }

  private buildHeaders(params: {
    basicAuth?: BasicAuth;
    userAgent?: string;
  }): KintoneAuthHeader {
    const { basicAuth, userAgent } = params;
    const basicAuthHeaders = basicAuth
      ? {
          Authorization: `Basic ${Base64.encode(
            `${basicAuth.username}:${basicAuth.password}`
          )}`,
        }
      : {};
    const platformDepsHeaders = platformDeps.buildHeaders({ userAgent });

    const commonHeaders = { ...platformDepsHeaders, ...basicAuthHeaders };

    switch (this.auth.type) {
      case "password": {
        return {
          ...commonHeaders,
          "X-Cybozu-Authorization": Base64.encode(
            `${this.auth.username}:${this.auth.password}`
          ),
        };
      }
      case "apiToken": {
        const apiToken = this.auth.apiToken;
        if (Array.isArray(apiToken)) {
          return { ...commonHeaders, "X-Cybozu-API-Token": apiToken.join(",") };
        }
        return { ...commonHeaders, "X-Cybozu-API-Token": apiToken };
      }
      case "oAuthToken": {
        return {
          ...commonHeaders,
          Authorization: `Bearer ${this.auth.oAuthToken}`,
        };
      }
      default: {
        return { ...commonHeaders, "X-Requested-With": "XMLHttpRequest" };
      }
    }
  }

  private async getRequestToken(): Promise<string> {
    if (this.requestToken === null) {
      this.requestToken = await platformDeps.getRequestToken();
    }
    return this.requestToken;
  }
}
