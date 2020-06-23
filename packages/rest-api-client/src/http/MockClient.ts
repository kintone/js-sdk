import {
  HttpClient,
  RequestConfigBuilder,
  ErrorResponseHandler,
} from "./HttpClientInterface";
import FormData from "form-data";

type Log = {
  method: "get" | "post" | "put" | "delete";
  path: string;
  params: {
    [key: string]: any;
  };
};

export class MockClient implements HttpClient {
  private errorResponseHandler: ErrorResponseHandler;
  private requestConfigBuilder: RequestConfigBuilder;
  logs: Log[];
  responses: object[];

  constructor({
    errorResponseHandler,
    requestConfigBuilder,
  }: {
    errorResponseHandler: ErrorResponseHandler;
    requestConfigBuilder: RequestConfigBuilder;
  }) {
    this.errorResponseHandler = errorResponseHandler;
    this.requestConfigBuilder = requestConfigBuilder;
    this.logs = [];
    this.responses = [];
  }

  public mockResponse(mock: object) {
    this.responses.push(mock);
  }
  private createResponse<T extends object>(): T {
    const response = this.responses.shift() || {};
    if (response instanceof Error) {
      this.errorResponseHandler(response);
    }
    return response as T;
  }

  public async get<T extends object>(path: string, params: any): Promise<T> {
    const requestConfig = await this.requestConfigBuilder.build(
      "get",
      path,
      params
    );
    this.logs.push({ method: requestConfig.method, path, params });
    return this.createResponse<T>();
  }
  public async getData(path: string, params: any): Promise<ArrayBuffer> {
    const requestConfig = await this.requestConfigBuilder.build(
      "get",
      path,
      params
    );
    this.logs.push({ method: requestConfig.method, path, params });
    return this.createResponse<ArrayBuffer>();
  }
  public async post<T extends object>(path: string, params: any): Promise<T> {
    const requestConfig = await this.requestConfigBuilder.build(
      "post",
      path,
      params
    );
    this.logs.push({ method: requestConfig.method, path, params });
    return this.createResponse<T>();
  }
  public async postData<T extends object>(
    path: string,
    formData: FormData
  ): Promise<T> {
    const requestConfig = await this.requestConfigBuilder.build(
      "post",
      path,
      formData
    );
    this.logs.push({
      method: requestConfig.method,
      path,
      params: { formData },
    });
    return this.createResponse<T>();
  }
  public async put<T extends object>(path: string, params: any): Promise<T> {
    const requestConfig = await this.requestConfigBuilder.build(
      "put",
      path,
      params
    );
    this.logs.push({ method: requestConfig.method, path, params });
    return this.createResponse<T>();
  }
  public async delete<T extends object>(path: string, params: any): Promise<T> {
    const requestConfig = await this.requestConfigBuilder.build(
      "delete",
      path,
      params
    );
    this.logs.push({ method: requestConfig.method, path, params });
    return this.createResponse<T>();
  }
  public getLogs(): Log[] {
    return this.logs;
  }
}
