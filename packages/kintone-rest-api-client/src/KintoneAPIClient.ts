import { RecordClient } from "./client/RecordClient";
import { DefaultHttpClient } from "./http/";
import { Base64 } from "js-base64";

export type Auth = ApiTokenAuth | PasswordAuth | SessionAuth;

type ApiTokenAuth = {
  apiToken: string;
};

type PasswordAuth = {
  username: string;
  password: string;
};

type SessionAuth = {};

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

export class KintoneAPIClient {
  record: RecordClient;
  private headers: KintoneAuthHeader;

  constructor({ subdomain, auth }: { subdomain: string; auth: Auth }) {
    this.headers = this.buildAuthHeaders(auth);
    const url = `https://${subdomain}.cybozu.com/`;
    const httpClient = new DefaultHttpClient({ url, headers: this.headers });

    this.record = new RecordClient(httpClient);
  }

  public getHeaders() {
    return this.headers;
  }

  private buildAuthHeaders(auth: Auth): KintoneAuthHeader {
    if ("username" in auth) {
      const { username, password } = auth;
      // TODO: Support browser environment
      return {
        "X-Cybozu-Authorization": Base64.encode(`${username}:${password}`)
      };
    }
    if ("apiToken" in auth) {
      return { "X-Cybozu-API-Token": auth.apiToken };
    }
    return { "X-Requested-With": "XMLHttpRequest" };
  }
}
