import { BulkRequestClient } from "./client/BulkRequestClient";
import { AppClient } from "./client/AppClient";
import { RecordClient } from "./client/RecordClient";
import { FileClient } from "./client/FileClient";
import { DefaultHttpClient } from "./http/";
import { Base64 } from "js-base64";

type HTTPClientParams = {
  __REQUEST_TOKEN__?: string;
};

export type PartialAuth =
  | Omit<ApiTokenAuth, "type">
  | Omit<PasswordAuth, "type">
  | Omit<SessionAuth, "type">;

export type Auth = ApiTokenAuth | PasswordAuth | SessionAuth;

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

type KintoneAuthHeader =
  | {
      "X-Cybozu-Authorization": string;
    }
  | {
      "X-Cybozu-API-Token": string;
    }
  | {
      "X-Requested-With": "XMLHttpRequest";
    };

export class KintoneRestAPIClient {
  record: RecordClient;
  app: AppClient;
  file: FileClient;
  private bulkRequest_: BulkRequestClient;
  private headers: KintoneAuthHeader;

  constructor({
    host,
    auth: partialAuth = {},
    guestSpaceId
  }: {
    host: string;
    auth?: PartialAuth;
    guestSpaceId?: number | string;
  }) {
    const auth = this.buildAuth(partialAuth);
    const params = this.buildParams(auth);
    this.headers = this.buildHeaders(auth);

    const httpClient = new DefaultHttpClient({
      host,
      headers: this.headers,
      params
    });

    this.bulkRequest_ = new BulkRequestClient(httpClient);
    this.record = new RecordClient(httpClient, guestSpaceId);
    this.app = new AppClient(httpClient, guestSpaceId);
    this.file = new FileClient(httpClient, guestSpaceId);
  }

  public getHeaders() {
    return this.headers;
  }

  private buildAuth(partialAuth: PartialAuth): Auth {
    if ("username" in partialAuth) {
      return { type: "password", ...partialAuth };
    }
    if ("apiToken" in partialAuth) {
      return { type: "apiToken", ...partialAuth };
    }
    return {
      type: "session"
    };
  }

  private buildHeaders(auth: Auth): KintoneAuthHeader {
    switch (auth.type) {
      case "password": {
        return {
          "X-Cybozu-Authorization": Base64.encode(
            `${auth.username}:${auth.password}`
          )
        };
      }
      case "apiToken": {
        if (Array.isArray(auth.apiToken)) {
          return { "X-Cybozu-API-Token": auth.apiToken.join(",") };
        }
        return { "X-Cybozu-API-Token": auth.apiToken };
      }
      default: {
        return { "X-Requested-With": "XMLHttpRequest" };
      }
    }
  }

  private buildParams(auth: Auth): HTTPClientParams {
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
