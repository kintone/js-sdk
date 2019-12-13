import { HttpClient } from "./HttpClientInterface";
import FormData = require("form-data");

type Log = {
  method: "get" | "post" | "put" | "delete";
  path: string;
  params: {
    [key: string]: any;
  };
};

export class MockClient implements HttpClient {
  logs: Log[];
  responses: object[];

  constructor() {
    this.logs = [];
    this.responses = [];
  }

  public mockResponse(mock: object) {
    this.responses.push(mock);
  }
  private createResponse<T extends object>(): T {
    const response = this.responses.shift() || {};
    if (response instanceof Error) {
      throw response;
    }
    return response as T;
  }

  public async get<T extends object>(path: string, params: object): Promise<T> {
    this.logs.push({ method: "get", path, params });
    return this.createResponse<T>();
  }
  public async getData(path: string, params: object): Promise<ArrayBuffer> {
    this.logs.push({ method: "get", path, params });
    return this.createResponse<ArrayBuffer>();
  }
  public async post<T extends object>(
    path: string,
    params: object
  ): Promise<T> {
    this.logs.push({ method: "post", path, params });
    return this.createResponse<T>();
  }
  public async postData<T extends object>(
    path: string,
    formData: FormData
  ): Promise<T> {
    this.logs.push({ method: "post", path, params: { formData } });
    return this.createResponse<T>();
  }
  public async put<T extends object>(path: string, params: object): Promise<T> {
    this.logs.push({ method: "put", path, params });
    return this.createResponse<T>();
  }
  public async delete<T extends object>(
    path: string,
    params: object
  ): Promise<T> {
    this.logs.push({ method: "delete", path, params });
    return this.createResponse<T>();
  }
  public getLogs(): Log[] {
    return this.logs;
  }
}
