import Axios from "axios";
import { HttpClient } from "../HttpClientInterface";
import { Auth } from "../KintoneAPIClient";

export class AxiosClient implements HttpClient {
  private subdomain: string;
  private headers: object;

  // FIXME: Change the interface to accept `baseUrl` and `headers`
  constructor({ subdomain, auth }: { subdomain: string; auth: Auth }) {
    this.subdomain = subdomain;
    this.headers = { "X-Cybozu-API-Token": auth.apiToken };
  }

  // TODO: Divide the method into `get`, `post`, etc.
  async request(path: string, params: any) {
    const requestURL = `https://${this.subdomain}.cybozu.com${path}?app=${params.app}&id=${params.id}`;
    console.log(requestURL);
    console.log(this.headers);
    const { data } = await Axios.get(requestURL, { headers: this.headers });
    return data;
  }
}
