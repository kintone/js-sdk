import Axios, { AxiosError } from "axios";
import { HttpClient, ErrorResponse } from "./HttpClientInterface";
import FormData from "form-data";

export type HttpMethod = "get" | "post" | "put" | "delete";
export type Params = { [key: string]: unknown };
type ErrorResponseHandler = (errorResponse: ErrorResponse) => void;

export type RequestConfig = {
  method: HttpMethod;
  url: string;
  headers: any;
  data?: any;
};

export interface RequestHandler {
  build: (
    method: HttpMethod,
    path: string,
    params: Params | FormData,
    options?: { responseType: "arraybuffer" }
  ) => RequestConfig;
}

export class AxiosClient implements HttpClient {
  private errorResponseHandler: ErrorResponseHandler;
  private requestHandler: RequestHandler;

  constructor({
    errorResponseHandler,
    requestHandler
  }: {
    errorResponseHandler: ErrorResponseHandler;
    requestHandler: RequestHandler;
  }) {
    this.errorResponseHandler = errorResponseHandler;
    this.requestHandler = requestHandler;
  }

  public async get(path: string, params: any) {
    const requestConfig = this.requestHandler.build("get", path, params);
    return this.sendRequest(requestConfig);
  }

  public async getData(path: string, params: any) {
    const requestConfig = this.requestHandler.build("get", path, params, {
      responseType: "arraybuffer"
    });
    return this.sendRequest(requestConfig);
  }

  public async post(path: string, params: any) {
    const requestConfig = this.requestHandler.build("post", path, params);
    return this.sendRequest(requestConfig);
  }

  public async postData(path: string, formData: FormData) {
    const requestConfig = this.requestHandler.build("post", path, formData);
    return this.sendRequest(requestConfig);
  }

  public async put(path: string, params: any) {
    const requestConfig = this.requestHandler.build("put", path, params);
    return this.sendRequest(requestConfig);
  }

  public async delete(path: string, params: any) {
    const requestConfig = this.requestHandler.build("delete", path, params);
    return this.sendRequest(requestConfig);
  }

  private async sendRequest(requestConfig: RequestConfig) {
    let data;
    try {
      // eslint-disable-next-line new-cap
      const response = await Axios(requestConfig);
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
