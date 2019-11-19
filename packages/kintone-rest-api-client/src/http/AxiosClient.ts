import { KintoneAPIError } from "./../KintoneAPIError";
import Axios from "axios";
import qs from "qs";
import { HttpClient } from "./HttpClientInterface";

type Headers = object;
type Params = { [key: string]: unknown };

export class AxiosClient implements HttpClient {
  private url: string;
  private headers: Headers;
  private params: Params;

  constructor({
    url,
    headers,
    params
  }: {
    url: string;
    headers: Headers;
    params: Params;
  }) {
    this.url = url;
    this.headers = headers;
    this.params = params;
  }

  async get(path: string, params: any) {
    const requestURL = `${this.url}${path}?${qs.stringify(params)}`;
    // console.log(requestURL);
    let data;
    try {
      const response = await Axios.get(requestURL, { headers: this.headers });
      data = response.data;
    } catch (error) {
      // console.log(error.response);
      throw new KintoneAPIError(error.response);
    }
    return data;
  }

  async post(path: string, params: any) {
    const requestURL = `${this.url}${path}`;
    let data;
    try {
      const response = await Axios.post(
        requestURL,
        { ...params, ...this.params },
        {
          headers: this.headers
        }
      );
      data = response.data;
    } catch (error) {
      throw new KintoneAPIError(error.response);
    }
    return data;
  }

  async put(path: string, params: any) {
    const requestURL = `${this.url}${path}`;
    let data;
    try {
      const response = await Axios.put(
        requestURL,
        { ...params, ...this.params },
        {
          headers: this.headers
        }
      );
      data = response.data;
    } catch (error) {
      throw new KintoneAPIError(error.response);
    }
    return data;
  }

  async delete(path: string, params: any) {
    const requestURL = `${this.url}${path}?${qs.stringify({
      ...params,
      ...this.params
    })}`;
    let data;
    try {
      const response = await Axios.delete(requestURL, {
        headers: this.headers
      });
      data = response.data;
    } catch (error) {
      throw new KintoneAPIError(error.response);
    }
    return data;
  }
}
