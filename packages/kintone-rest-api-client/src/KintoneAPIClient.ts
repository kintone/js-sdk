import { RecordClient } from "./client/RecordClient";
import { HttpClient, DefaultHttpClient } from "./http/";

export type Auth = {
  apiToken: string;
};

export class KintoneAPIClient {
  private httpClient: HttpClient;
  record: RecordClient;

  constructor({ subdomain, auth }: { subdomain: string; auth: Auth }) {
    const headers = { "X-Cybozu-API-Token": auth.apiToken };
    const url = `https://${subdomain}.cybozu.com/`;
    this.httpClient = new DefaultHttpClient({ url, headers });

    this.record = new RecordClient(this.httpClient);
  }
}
