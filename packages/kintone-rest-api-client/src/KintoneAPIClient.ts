import { RecordClient } from "./client/RecordClient";
import { DefaultHttpClient } from "./http/";

export type Auth = ApiTokenAuth | PasswordAuth | SessionAuth;

type ApiTokenAuth = {
  apiToken: string;
};

type PasswordAuth = {
  username: string;
  password: string;
};

type SessionAuth = {};

export class KintoneAPIClient {
  record: RecordClient;

  constructor({ subdomain, auth }: { subdomain: string; auth: Auth }) {
    const headers = this.buildAuthHeaders(auth);
    const url = `https://${subdomain}.cybozu.com/`;
    const httpClient = new DefaultHttpClient({ url, headers });

    this.record = new RecordClient(httpClient);
  }

  private buildAuthHeaders(auth: Auth) {
    if ("username" in auth) {
      const { username, password } = auth;
      // TODO: Support browser environment
      return {
        "X-Cybozu-Authorization": Buffer.from(
          `${username}:${password}`
        ).toString("base64")
      };
    }
    if ("apiToken" in auth) {
      return { "X-Cybozu-API-Token": auth.apiToken };
    }
    return { "X-Requested-With": "XMLHttpRequest" };
  }
}
