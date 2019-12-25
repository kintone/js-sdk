import { KintoneRestAPIError } from "../KintoneRestAPIError";
import Axios from "axios";
import qs from "qs";
import { HttpClient } from "./HttpClientInterface";
import FormData from "form-data";

type Headers = object;
type Params = { [key: string]: unknown };

export class AxiosClient implements HttpClient {
  private host: string;
  private headers: Headers;
  private params: Params;

  constructor({
    host,
    headers,
    params
  }: {
    host: string;
    headers: Headers;
    params: Params;
  }) {
    this.host = host;
    this.headers = headers;
    this.params = params;
  }

  public async get(path: string, params: any) {
    const requestURL = `${this.host}${path}?${qs.stringify(params)}`;
    // console.log(requestURL);
    let data;
    try {
      const response = await Axios.get(requestURL, { headers: this.headers });
      data = response.data;
    } catch (error) {
      // console.log(error.response);
      throw new KintoneRestAPIError(error.response);
    }
    return data;
  }

  public async getData(path: string, params: any) {
    const requestURL = `${this.host}${path}?${qs.stringify(params)}`;
    let data;
    try {
      const response = await Axios.get(requestURL, {
        headers: this.headers,
        responseType: "arraybuffer"
      });
      data = response.data;
    } catch (error) {
      throw new KintoneRestAPIError(error.response);
    }
    return data;
  }

  public async post(path: string, params: any) {
    const requestURL = `${this.host}${path}`;
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
      throw new KintoneRestAPIError(error.response);
    }
    return data;
  }

  public async postData(path: string, formData: FormData) {
    const requestURL = `${this.host}${path}`;
    let data;
    const headers =
      typeof formData.getHeaders === "function"
        ? { ...this.headers, ...formData.getHeaders() }
        : this.headers;
    try {
      Object.keys(this.params).forEach(key => {
        formData.append(key, this.params[key]);
      });
      const response = await Axios.post(requestURL, formData, { headers });
      data = response.data;
    } catch (error) {
      throw new KintoneRestAPIError(error.response);
    }
    return data;
  }

  public async put(path: string, params: any) {
    const requestURL = `${this.host}${path}`;
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
      throw new KintoneRestAPIError(error.response);
    }
    return data;
  }

  public async delete(path: string, params: any) {
    const requestURL = `${this.host}${path}?${qs.stringify({
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
      throw new KintoneRestAPIError(error.response);
    }
    return data;
  }
}
