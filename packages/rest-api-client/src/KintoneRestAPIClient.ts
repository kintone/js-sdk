import { BulkRequestClient } from "./client/BulkRequestClient";
import { AppClient } from "./client/AppClient";
import { RecordClient } from "./client/RecordClient";
import { FileClient } from "./client/FileClient";
import { DefaultHttpClient } from "./http/";
import { Base64 } from "js-base64";
import { KintoneRestAPIError } from "./KintoneRestAPIError";
import { ErrorResponse } from "./http/HttpClientInterface";

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
      errorResponseHandler
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
