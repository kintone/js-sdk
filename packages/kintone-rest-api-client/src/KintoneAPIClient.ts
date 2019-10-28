import { RecordClient } from "./client/RecordClient";
import { HttpClient } from "./HttpClientInterface";
import { AxiosClient } from "./http/AxiosClient";

export type Auth = {
  apiToken: string;
};

export class KintoneAPIClient {
  private httpClient: HttpClient;
  record: RecordClient;

  constructor({ subdomain, auth }: { subdomain: string; auth: Auth }) {
    this.httpClient = new AxiosClient({ subdomain, auth });

    this.record = new RecordClient(this.httpClient);
  }
}
