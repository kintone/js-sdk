import Axios, { AxiosError } from "axios";
import {
  HttpClient,
  ErrorResponseHandler,
  RequestConfigBuilder,
  RequestConfig,
} from "./HttpClientInterface";
import FormData from "form-data";

export class AxiosClient implements HttpClient {
  private errorResponseHandler: ErrorResponseHandler;
  private requestConfigBuilder: RequestConfigBuilder;

  constructor({
    errorResponseHandler,
    requestConfigBuilder,
  }: {
    errorResponseHandler: ErrorResponseHandler;
    requestConfigBuilder: RequestConfigBuilder;
  }) {
    this.errorResponseHandler = errorResponseHandler;
    this.requestConfigBuilder = requestConfigBuilder;
  }

  public async get(path: string, params: any) {
    const requestConfig = this.requestConfigBuilder.build("get", path, params);
    return this.sendRequest(requestConfig);
  }

  public async getData(path: string, params: any) {
    const requestConfig = this.requestConfigBuilder.build("get", path, params, {
      responseType: "arraybuffer",
    });
    return this.sendRequest(requestConfig);
  }

  public async post(path: string, params: any) {
    const requestConfig = this.requestConfigBuilder.build("post", path, params);
    return this.sendRequest(requestConfig);
  }

  public async postData(path: string, formData: FormData) {
    const requestConfig = this.requestConfigBuilder.build(
      "post",
      path,
      formData
    );
    return this.sendRequest(requestConfig);
  }

  public async put(path: string, params: any) {
    const requestConfig = this.requestConfigBuilder.build("put", path, params);
    return this.sendRequest(requestConfig);
  }

  public async delete(path: string, params: any) {
    const requestConfig = this.requestConfigBuilder.build(
      "delete",
      path,
      params
    );
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
