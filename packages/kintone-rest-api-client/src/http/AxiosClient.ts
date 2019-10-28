import Axios from "axios";
import qs from "qs";
import { HttpClient } from "../HttpClientInterface";

type Headers = object;

export class AxiosClient implements HttpClient {
  private url: string;
  private headers: Headers;

  constructor({ url, headers }: { url: string; headers: Headers }) {
    this.url = url;
    this.headers = headers;
  }

  async get(path: string, params: any) {
    const requestURL = `${this.url}${path}?${qs.stringify(params)}`;
    const { data } = await Axios.get(requestURL, { headers: this.headers });
    return data;
  }

  async post(path: string, params: any) {
    const requestURL = `${this.url}${path}`;
    const { data } = await Axios.post(requestURL, params, {
      headers: this.headers
    });
    return data;
  }

  async put(path: string, params: any) {
    const requestURL = `${this.url}${path}`;
    const { data } = await Axios.put(requestURL, params, {
      headers: this.headers
    });
    return data;
  }

  async delete(path: string, params: any) {
    const requestURL = `${this.url}${path}?${qs.stringify(params)}`;
    const { data } = await Axios.delete(requestURL, {
      headers: this.headers
    });
    return data;
  }
}
