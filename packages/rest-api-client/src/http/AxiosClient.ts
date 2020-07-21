import Axios from "axios";
import {
  HttpClient,
  RequestConfigBuilder,
  RequestConfig,
  ResponseHandler,
} from "./HttpClientInterface";
import FormData from "form-data";

export class AxiosClient implements HttpClient {
  private responseHandler: ResponseHandler;
  private requestConfigBuilder: RequestConfigBuilder;

  constructor({
    responseHandler,
    requestConfigBuilder,
  }: {
    responseHandler: ResponseHandler;
    requestConfigBuilder: RequestConfigBuilder;
  }) {
    this.responseHandler = responseHandler;
    this.requestConfigBuilder = requestConfigBuilder;
  }

  public async get(path: string, params: any) {
    const requestConfig = await this.requestConfigBuilder.build(
      "get",
      path,
      params
    );
    return this.sendRequest(requestConfig);
  }

  public async getData(path: string, params: any) {
    const requestConfig = await this.requestConfigBuilder.build(
      "get",
      path,
      params,
      {
        responseType: "arraybuffer",
      }
    );
    return this.sendRequest(requestConfig);
  }

  public async post(path: string, params: any) {
    const requestConfig = await this.requestConfigBuilder.build(
      "post",
      path,
      params
    );
    return this.sendRequest(requestConfig);
  }

  public async postData(path: string, formData: FormData) {
    const requestConfig = await this.requestConfigBuilder.build(
      "post",
      path,
      formData
    );
    return this.sendRequest(requestConfig);
  }

  public async put(path: string, params: any) {
    const requestConfig = await this.requestConfigBuilder.build(
      "put",
      path,
      params
    );
    return this.sendRequest(requestConfig);
  }

  public async delete(path: string, params: any) {
    const requestConfig = await this.requestConfigBuilder.build(
      "delete",
      path,
      params
    );
    return this.sendRequest(requestConfig);
  }

  private sendRequest(requestConfig: RequestConfig) {
    return this.responseHandler.handle(
      // eslint-disable-next-line new-cap
      Axios({
        ...requestConfig,

        // NOTE: For defining the max size of the http request content, `maxBodyLength` will be used after version 0.20.0.
        // `maxContentLength` will be still needed for defining the max size of the http response content.
        // ref: https://github.com/axios/axios/pull/2781/files
        // maxBodyLength: Infinity,

        maxContentLength: Infinity,
      })
    );
  }
}
