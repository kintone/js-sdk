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

  public async get<T extends object>(path: string, params: any) {
    const requestConfig = await this.requestConfigBuilder.build(
      "get",
      path,
      params
    );
    return (await this.sendRequest(requestConfig)) as Promise<T>;
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
    return (await this.sendRequest(requestConfig)) as Promise<ArrayBuffer>;
  }

  public async post<T extends object>(path: string, params: any) {
    const requestConfig = await this.requestConfigBuilder.build(
      "post",
      path,
      params
    );
    return (await this.sendRequest(requestConfig)) as Promise<T>;
  }

  public async postData<T extends object>(path: string, formData: FormData) {
    const requestConfig = await this.requestConfigBuilder.build(
      "post",
      path,
      formData
    );
    return (await this.sendRequest(requestConfig)) as Promise<T>;
  }

  public async put<T extends object>(path: string, params: any) {
    const requestConfig = await this.requestConfigBuilder.build(
      "put",
      path,
      params
    );
    return (await this.sendRequest(requestConfig)) as Promise<T>;
  }

  public async delete<T extends object>(path: string, params: any) {
    const requestConfig = await this.requestConfigBuilder.build(
      "delete",
      path,
      params
    );
    return (await this.sendRequest(requestConfig)) as Promise<T>;
  }

  private sendRequest(requestConfig: RequestConfig) {
    return this.responseHandler.handle(
      // eslint-disable-next-line new-cap
      Axios({
        ...requestConfig,

        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      })
    );
  }
}
