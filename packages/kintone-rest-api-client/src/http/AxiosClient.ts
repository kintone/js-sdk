import Axios from "axios";
import { HttpClient } from "../HttpClientInterface";

type Headers = object;

export class AxiosClient implements HttpClient {
  private url: string;
  private headers: Headers;

  // FIXME: Change the interface to accept `baseUrl` and `headers`
  constructor({ url, headers }: { url: string; headers: Headers }) {
    this.url = url;
    this.headers = headers;
  }

  // TODO: Divide the method into `get`, `post`, etc.
  async request(path: string, params: any) {
    const requestURL = `${this.url}${path}?app=${params.app}&id=${params.id}`;
    console.log(requestURL);
    console.log(this.headers);
    const { data } = await Axios.get(requestURL, { headers: this.headers });
    return data;
  }
}
