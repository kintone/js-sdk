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
  Auth,
  ApiTokenAuth,
  PasswordAuth,
  SessionAuth,
  OAuthTokenAuth,
  BasicAuth,
} from "./KintoneRestAPIClient";
import { platformDeps } from "./platform/";
import { UnsupportedPlatformError } from "./platform/UnsupportedPlatformError";

type DiscriminatedAuth =
  | ApiTokenAuth
  | PasswordAuth
  | SessionAuth
  | OAuthTokenAuth;

const THRESHOLD_AVOID_REQUEST_URL_TOO_LARGE = 4096;

export class KintoneRequestConfigBuilder implements RequestConfigBuilder {
  private baseUrl: string;
  private headers: KintoneAuthHeader;
  private requestToken?: string;
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
    auth?: Auth;
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
    this.auth = buildDiscriminatedAuth(auth ?? {});
    this.headers = this.buildHeaders(basicAuth);
    this.clientCertAuth = clientCertAuth;
    this.proxy = proxy;
  }
  public build(
    method: HttpMethod,
    path: string,
    params: Params | FormData,
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
            data: this.buildParams(params),
          };
        }
        return {
          ...requestConfig,
          url: requestUrl,
        };
      }
      case "post": {
        if (params instanceof FormData) {
          const formData = params;
          const paramObject = this.buildParams();
          Object.keys(paramObject).forEach((key) => {
            formData.append(key, (paramObject as any)[key]);
          });
          return {
            ...requestConfig,
            headers:
              typeof formData.getHeaders === "function"
                ? { ...this.headers, ...formData.getHeaders() }
                : this.headers,
            data: formData,
          };
        }
        return {
          ...requestConfig,
          data: this.buildParams(params),
        };
      }
      case "put": {
        return {
          ...requestConfig,
          data: this.buildParams(params),
        };
      }
      case "delete": {
        const requestUrl = this.buildRequestUrl(path, this.buildParams(params));
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

  // FIXME: this doesn't add this.params on the query
  // because this.params is for __REQUEST_TOKEN__.
  // But it depends on what this.params includes.
  // we should consider to rename this.params.
  private buildRequestUrl(path: string, params: Params | FormData): string {
    return `${this.baseUrl}${path}?${qs.stringify(params)}`;
  }

  private buildParams(params?: Params | FormData) {
    if (this.auth.type === "session") {
      try {
        return {
          __REQUEST_TOKEN__:
            this.requestToken ?? platformDeps.getRequestToken(),
          ...params,
        };
      } catch (e) {
        if (e instanceof UnsupportedPlatformError) {
          throw new Error(
            `session authentication is not supported in ${e.platform} environment.`
          );
        }
        throw e;
      }
    }
    // This params are always sent as a request body.
    return {};
  }

  private buildHeaders(basicAuth?: BasicAuth): KintoneAuthHeader {
    const headers = basicAuth
      ? {
          Authorization: `Basic ${Base64.encode(
            `${basicAuth.username}:${basicAuth.password}`
          )}`,
        }
      : {};
    switch (this.auth.type) {
      case "password": {
        return {
          ...headers,
          "X-Cybozu-Authorization": Base64.encode(
            `${this.auth.username}:${this.auth.password}`
          ),
        };
      }
      case "apiToken": {
        const apiToken = this.auth.apiToken;
        if (Array.isArray(apiToken)) {
          return { ...headers, "X-Cybozu-API-Token": apiToken.join(",") };
        }
        return { ...headers, "X-Cybozu-API-Token": apiToken };
      }
      case "oAuthToken": {
        return { ...headers, Authorization: `Bearer ${this.auth.oAuthToken}` };
      }
      default: {
        return { ...headers, "X-Requested-With": "XMLHttpRequest" };
      }
    }
  }
}

function buildDiscriminatedAuth(auth: Auth): DiscriminatedAuth {
  if ("username" in auth) {
    return { type: "password", ...auth };
  }
  if ("apiToken" in auth) {
    return { type: "apiToken", ...auth };
  }
  if ("oAuthToken" in auth) {
    return { type: "oAuthToken", ...auth };
  }
  return {
    type: "session",
  };
}
