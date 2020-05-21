import FormData from "form-data";
import qs from "qs";
import { Base64 } from "js-base64";

import {
  RequestConfigBuilder,
  RequestConfig,
  HttpMethod,
  Params,
  ProxyConfig,
} from "./http/HttpClientInterface";
import {
  KintoneAuthHeader,
  BasicAuth,
  DiscriminatedAuth,
} from "./KintoneRestAPIClient";
import { platformDeps } from "./platform/";

type Data = Params | FormData;

const THRESHOLD_AVOID_REQUEST_URL_TOO_LARGE = 4096;

export class KintoneRequestConfigBuilder implements RequestConfigBuilder {
  private baseUrl: string;
  private headers: KintoneAuthHeader;
  private auth: DiscriminatedAuth;
  private clientCertAuth?:
    | {
        pfx: Buffer;
        password: string;
      }
    | {
        pfxFilePath: string;
        password: string;
      };
  private proxy?: ProxyConfig;
  constructor({
    baseUrl,
    auth,
    basicAuth,
    clientCertAuth,
    proxy,
  }: {
    baseUrl: string;
    auth: DiscriminatedAuth;
    basicAuth?: BasicAuth;
    clientCertAuth?:
      | {
          pfx: Buffer;
          password: string;
        }
      | {
          pfxFilePath: string;
          password: string;
        };
    proxy?: ProxyConfig;
  }) {
    this.baseUrl = baseUrl;
    this.auth = auth;
    this.headers = this.buildHeaders(basicAuth);
    this.clientCertAuth = clientCertAuth;
    this.proxy = proxy;
  }

  public build(
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
        clientCertAuth: this.clientCertAuth,
      }),
      proxy: this.proxy,
    };

    switch (method) {
      case "get": {
        const requestUrl = this.buildRequestUrl(path, params);
        if (requestUrl.length > THRESHOLD_AVOID_REQUEST_URL_TOO_LARGE) {
          return {
            ...requestConfig,
            method: "post" as const,
            headers: { ...this.headers, "X-HTTP-Method-Override": "GET" },
            data: this.buildData(params),
          };
        }
        return {
          ...requestConfig,
          url: requestUrl,
        };
      }
      case "post": {
        if (params instanceof FormData) {
          const formData = this.buildData(params);
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
          data: this.buildData(params),
        };
      }
      case "put": {
        return {
          ...requestConfig,
          data: this.buildData(params),
        };
      }
      case "delete": {
        const requestUrl = this.buildRequestUrl(path, this.buildData(params));
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

  private buildRequestUrl(path: string, params: Data): string {
    return `${this.baseUrl}${path}?${qs.stringify(params)}`;
  }

  private buildData<T extends Data>(params: T): T {
    if (this.auth.type === "session") {
      const requestToken = platformDeps.getRequestToken();
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

  private buildHeaders(basicAuth?: BasicAuth): KintoneAuthHeader {
    const basicAuthHeaders = basicAuth
      ? {
          Authorization: `Basic ${Base64.encode(
            `${basicAuth.username}:${basicAuth.password}`
          )}`,
        }
      : {};
    const platformDepsHeaders = platformDeps.buildHeaders();

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
}
