import { HttpClient } from "./HttpClientInterface";

type Log = {
  method: "get" | "post" | "put" | "delete";
  path: string;
  params: object;
};

export class MockClient implements HttpClient {
  logs: Log[];
  constructor() {
    this.logs = [];
  }
  public async get<T extends object>(path: string, params: object): Promise<T> {
    this.logs.push({ method: "get", path, params });
    return {} as T;
  }
  public async post<T extends object>(
    path: string,
    params: object
  ): Promise<T> {
    this.logs.push({ method: "post", path, params });
    return {} as T;
  }
  public async put<T extends object>(path: string, params: object): Promise<T> {
    this.logs.push({ method: "put", path, params });
    return {} as T;
  }
  public async delete<T extends object>(
    path: string,
    params: object
  ): Promise<T> {
    this.logs.push({ method: "delete", path, params });
    return {} as T;
  }
  public getLogs(): Log[] {
    return this.logs;
  }
}
