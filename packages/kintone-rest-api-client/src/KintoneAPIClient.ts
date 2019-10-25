import axios from "axios";
import { RecordClient } from "./client/RecordClient";

type Auth = {
  apiToken: string;
};
type AppID = string | number;
type RecordID = string | number;

export interface HttpClient {
  request: (path: string, params: object) => any;
}

export class AxiosClient implements HttpClient {
  private subdomain: string;
  private headers: object;

  // FIXME: Change the interface to accept `baseUrl` and `headers`
  constructor({ subdomain, auth }: { subdomain: string; auth: Auth }) {
    this.subdomain = subdomain;
    this.headers = { "X-Cybozu-API-Token": auth.apiToken };
  }

  async request(path: string, params: any) {
    const requestURL = `https://${this.subdomain}.cybozu.com${path}?app=${params.app}&id=${params.id}`;
    console.log(requestURL);
    console.log(this.headers);
    const { data } = await axios.get(requestURL, { headers: this.headers });
    return data;
  }
}

export class KintoneAPIClient {
  private httpClient: HttpClient;
  record: RecordClient;

  constructor({ subdomain, auth }: { subdomain: string; auth: Auth }) {
    this.httpClient = new AxiosClient({ subdomain, auth });

    this.record = new RecordClient(this.httpClient);
  }
}
