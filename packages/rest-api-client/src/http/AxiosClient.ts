import Axios, { AxiosError, AxiosRequestConfig } from "axios";
import qs from "qs";
import { HttpClient, ErrorResponse } from "./HttpClientInterface";
import FormData from "form-data";

export type HttpMethod = "get" | "post" | "put" | "delete";
type Headers = object;
export type Params = { [key: string]: unknown };
type ErrorResponseHandler = (errorResponse: ErrorResponse) => void;

export interface RequestHandler {
  build: (
    method: HttpMethod,
    path: string,
    params: Params
  ) => AxiosRequestConfig;
}

const THRESHOLD_AVOID_REQUEST_URL_TOO_LARGE = 4096;

export class AxiosClient implements HttpClient {
  private baseUrl: string;
  private headers: Headers;
  private params: Params;
  private errorResponseHandler: ErrorResponseHandler;
  private requestHandler: RequestHandler;

  constructor({
    baseUrl,
    headers,
    params,
    errorResponseHandler,
    requestHandler
  }: {
    baseUrl: string;
    headers: Headers;
    params: Params;
    errorResponseHandler: ErrorResponseHandler;
    requestHandler: RequestHandler;
  }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
    this.params = params;
    this.errorResponseHandler = errorResponseHandler;
    this.requestHandler = requestHandler;
  }

  public async get(path: string, params: any) {
    const requestURL = `${this.baseUrl}${path}?${qs.stringify(params)}`;
    if (requestURL.length > THRESHOLD_AVOID_REQUEST_URL_TOO_LARGE) {
      return this.postUsingGetMethod(path, params);
    }
    // console.log(requestURL);
    let data;
    try {
      const response = await Axios.get(requestURL, { headers: this.headers });
      data = response.data;
    } catch (error) {
      this.handleError(error);
    }
    return data;
  }

  public async getData(path: string, params: any) {
    const requestURL = `${this.baseUrl}${path}?${qs.stringify(params)}`;
    let data;
    try {
      const response = await Axios.get(requestURL, {
        headers: this.headers,
        responseType: "arraybuffer"
      });
      data = response.data;
    } catch (error) {
      this.handleError(error);
    }
    return data;
  }

  public async post(path: string, params: any) {
    const requestConfig = this.requestHandler.build("post", path, params);
    let data;
    try {
      const response = await Axios(requestConfig);
      data = response.data;
    } catch (error) {
      this.handleError(error);
    }
    return data;

    // const requestURL = `${this.baseUrl}${path}`;
    // let data;
    // try {
    //   const response = await Axios.post(
    //     requestURL,
    //     { ...params, ...this.params },
    //     {
    //       headers: this.headers
    //     }
    //   );
    //   data = response.data;
    // } catch (error) {
    //   this.handleError(error);
    // }
    // return data;
  }

  private async postUsingGetMethod(path: string, params: any) {
    const requestURL = `${this.baseUrl}${path}?_method=GET`;
    let data;
    try {
      const response = await Axios.post(
        requestURL,
        { ...params, ...this.params },
        {
          headers: { ...this.headers, "X-HTTP-Method-Override": "GET" }
        }
      );
      data = response.data;
    } catch (error) {
      this.handleError(error);
    }
    return data;
  }

  public async postData(path: string, formData: FormData) {
    const requestURL = `${this.baseUrl}${path}`;
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
      this.handleError(error);
    }
    return data;
  }

  public async put(path: string, params: any) {
    const requestURL = `${this.baseUrl}${path}`;
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
      this.handleError(error);
    }
    return data;
  }

  public async delete(path: string, params: any) {
    const requestURL = `${this.baseUrl}${path}?${qs.stringify({
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
      this.handleError(error);
    }
    return data;
  }

  private handleError(error: AxiosError) {
    if (error.response) {
      this.errorResponseHandler(error.response);
    }
    throw new Error(error.toString());
  }
}
