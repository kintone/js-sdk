import type {
  HttpClient,
  RequestConfigBuilder,
  ResponseHandler,
} from "./HttpClientInterface";
import { Response } from "./HttpClientInterface";
import type FormData from "form-data";
import { KintoneResponseHandler } from "../KintoneResponseHandler";

type Log = {
  method: "get" | "post" | "put" | "delete";
  path: string;
  params: {
    [key: string]: any;
  };
};

export class MockClient implements HttpClient {
  private responseHandler: ResponseHandler;
  private requestConfigBuilder: RequestConfigBuilder;
  logs: Log[];
  responses: any[];

  constructor({
    responseHandler,
    requestConfigBuilder,
  }: {
    responseHandler: ResponseHandler;
    requestConfigBuilder: RequestConfigBuilder;
  }) {
    this.responseHandler = responseHandler;
    this.requestConfigBuilder = requestConfigBuilder;
    this.logs = [];
    this.responses = [];
  }

  public mockResponse(mock: unknown, headers: Record<string, string> = {}) {
    this.responses.push({ data: mock, headers });
  }
  private createResponse<T extends object>(): T {
    const response = this.responses.shift() || { data: {}, headers: {} };
    return this.responseHandler.handle(
      response.data instanceof Error
        ? Promise.reject(response.data)
        : Promise.resolve(response)
    ) as T;
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

export const buildMockClient = (
  requestConfigBuilder: RequestConfigBuilder,
  responseHandler = new KintoneResponseHandler({
    enableAbortSearchError: true,
  })
) => {
  return new MockClient({ requestConfigBuilder, responseHandler });
};
