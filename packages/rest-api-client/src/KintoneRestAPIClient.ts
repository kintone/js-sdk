import qs from "qs";

import { BulkRequestClient } from "./client/BulkRequestClient";
import { AppClient } from "./client/AppClient";
import { RecordClient } from "./client/RecordClient";
import { FileClient } from "./client/FileClient";
import { DefaultHttpClient } from "./http/";
import { Base64 } from "js-base64";
import { KintoneRestAPIError } from "./KintoneRestAPIError";
import { ErrorResponse } from "./http/HttpClientInterface";
import { RequestHandler, HttpMethod, Params } from "./http/AxiosClient";
import FormData from "form-data";
import { AxiosRequestConfig } from "axios";

type HTTPClientParams = {
  __REQUEST_TOKEN__?: string;
};

export type Auth =
  | Omit<ApiTokenAuth, "type">
  | Omit<PasswordAuth, "type">
  | Omit<SessionAuth, "type">;

type DiscriminatedAuth = ApiTokenAuth | PasswordAuth | SessionAuth;

type ApiTokenAuth = {
  type: "apiToken";
  apiToken: string | string[];
};

type PasswordAuth = {
  type: "password";
  username: string;
  password: string;
};

type SessionAuth = {
  type: "session";
};

type BasicAuth = {
  username: string;
  password: string;
};

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
    };

export class KintoneRestAPIClient {
  record: RecordClient;
  app: AppClient;
  file: FileClient;
  private bulkRequest_: BulkRequestClient;
  private headers: KintoneAuthHeader;
  private baseUrl?: string;

  constructor(
    options: {
      baseUrl?: string;
      auth?: Auth;
      guestSpaceId?: number | string;
      basicAuth?: BasicAuth;
    } = {}
  ) {
    const auth = this.buildAuth(options.auth ?? {});
    const params = this.buildParams(auth);
    this.headers = this.buildHeaders(auth, options.basicAuth);

    this.baseUrl = options.baseUrl ?? location?.origin;
    if (typeof this.baseUrl === "undefined") {
      throw new Error("in Node environment, baseUrl is required");
    }

    const errorResponseHandler = (errorResponse: ErrorResponse) => {
      throw new KintoneRestAPIError(errorResponse);
    };

    const httpClient = new DefaultHttpClient({
      baseUrl: this.baseUrl,
      headers: this.headers,
      params,
      errorResponseHandler,
      requestHandler: new KintoneRequestHandler(
        this.baseUrl,
        this.headers,
        params
      )
    });
    const { guestSpaceId } = options;

    this.bulkRequest_ = new BulkRequestClient(httpClient, guestSpaceId);
    this.record = new RecordClient(httpClient, guestSpaceId);
    this.app = new AppClient(httpClient, guestSpaceId);
    this.file = new FileClient(httpClient, guestSpaceId);
  }

  public getBaseUrl() {
    return this.baseUrl;
  }

  public getHeaders() {
    return this.headers;
  }

  private buildAuth(auth: Auth): DiscriminatedAuth {
    if ("username" in auth) {
      return { type: "password", ...auth };
    }
    if ("apiToken" in auth) {
      return { type: "apiToken", ...auth };
    }
    return {
      type: "session"
    };
  }

  private buildHeaders(
    auth: DiscriminatedAuth,
    basicAuth?: BasicAuth
  ): KintoneAuthHeader {
    const headers = basicAuth
      ? {
          Authorization: `Basic ${Base64.encode(
            `${basicAuth.username}:${basicAuth.password}`
          )}`
        }
      : {};

    switch (auth.type) {
      case "password": {
        return {
          ...headers,
          "X-Cybozu-Authorization": Base64.encode(
            `${auth.username}:${auth.password}`
          )
        };
      }
      case "apiToken": {
        if (Array.isArray(auth.apiToken)) {
          return { ...headers, "X-Cybozu-API-Token": auth.apiToken.join(",") };
        }
        return { ...headers, "X-Cybozu-API-Token": auth.apiToken };
      }
      default: {
        return { ...headers, "X-Requested-With": "XMLHttpRequest" };
      }
    }
  }

  private buildParams(auth: DiscriminatedAuth): HTTPClientParams {
    let requestToken;
    if (auth.type === "session") {
      if (
        typeof kintone === "undefined" ||
        typeof kintone.getRequestToken !== "function"
      ) {
        throw new Error("session authentication must specify a request token");
      }
      requestToken = kintone.getRequestToken();
    }
    // This params are always sent as a request body.
    return requestToken
      ? {
          __REQUEST_TOKEN__: requestToken
        }
      : {};
  }

  public bulkRequest(params: {
    requests: Array<{
      method: string;
      api: string;
      payload: object;
    }>;
  }): Promise<object[]> {
    return this.bulkRequest_.send(params);
  }
}

// TODO: create KintoneRequestHandler.ts
export class KintoneRequestHandler implements RequestHandler {
  private baseUrl: string;
  private headers: KintoneAuthHeader;
  private params: HTTPClientParams;
  constructor(
    baseUrl: string,
    headers: KintoneAuthHeader,
    params: HTTPClientParams
  ) {
    this.baseUrl = baseUrl;
    this.headers = headers;
    this.params = params;
  }
  public build(
    method: HttpMethod,
    path: string,
    params: Params | FormData,
    options?: { responseType: "arraybuffer" }
  ) {
    const requesConfig: AxiosRequestConfig = {
      method,
      headers: this.headers,
      url: `${this.baseUrl}${path}`,
      ...(options ? options : {})
    };

    // send params as a query string
    if (method === "delete" || method === "get") {
      if (
        method === "get" &&
        `${this.baseUrl}${path}?${qs.stringify(params)}`.length > 4096
      ) {
        return {
          ...requesConfig,
          method: "post" as const,
          headers: { ...this.headers, "X-HTTP-Method-Override": "GET" },
          data: { ...this.params, ...params }
        };
      }

      // FIXME: this doesn't add this.params on the query
      // because this.params is for __REQUEST_TOKEN__.
      // But it depends on what this.params includes.
      // we should consider to rename this.params.
      return {
        ...requesConfig,
        url: `${this.baseUrl}${path}?${qs.stringify(params)}`
      };
      // send params as a FormData
    } else if (method === "post" && params instanceof FormData) {
      Object.keys(this.params).forEach(key => {
        params.append(key, (this.params as any)[key]);
      });
      return {
        ...requesConfig,
        headers:
          typeof params.getHeaders === "function"
            ? { ...this.headers, ...params.getHeaders() }
            : this.headers,
        data: params
      };
    }
    return { ...requesConfig, data: { ...this.params, ...params } };
  }
}
