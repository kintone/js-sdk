import Axios from "axios";
import qs from "qs";
import { HttpClient, HTTPClientParams } from "./HttpClientInterface";

type Headers = object;

export class AxiosClient implements HttpClient {
  private url: string;
  private headers: Headers;
  params: HTTPClientParams;

  constructor({
    url,
    headers,
    params
  }: {
    url: string;
    headers: Headers;
    params: HTTPClientParams;
  }) {
    this.url = url;
    this.headers = headers;
    this.params = params;
  }

  async get(path: string, params: any) {
    const requestURL = `${this.url}${path}?${qs.stringify(params)}`;
    const { data } = await Axios.get(requestURL, { headers: this.headers });
    return data;
  }

  async post(path: string, params: any) {
    const requestURL = `${this.url}${path}`;
    const { data } = await Axios.post(
      requestURL,
      { ...params, ...this.params },
      {
        headers: this.headers
      }
    );
    return data;
  }

  async put(path: string, params: any) {
    const requestURL = `${this.url}${path}`;
    const { data } = await Axios.put(
      requestURL,
      { ...params, ...this.params },
      {
        headers: this.headers
      }
    );
    return data;
  }

  async delete(path: string, params: any) {
    const requestURL = `${this.url}${path}?${qs.stringify({
      ...params,
      ...this.params
    })}`;
    const { data } = await Axios.delete(requestURL, {
      headers: this.headers
    });
    return data;
  }
}
