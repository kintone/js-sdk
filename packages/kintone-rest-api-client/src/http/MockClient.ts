import { HttpClient } from "./HttpClientInterface";

export class MockClient implements HttpClient {
  logs: any[];
  constructor() {
    this.logs = [];
  }
  public async get<T extends object>(path: string, params: object): Promise<T> {
    this.logs.push({ path, params });
    return {} as T;
  }
  public async post<T extends object>(
    path: string,
    params: object
  ): Promise<T> {
    this.logs.push({ path, params });
    return {} as T;
  }
  public async put<T extends object>(path: string, params: object): Promise<T> {
    this.logs.push({ path, params });
    return {} as T;
  }
  public async delete<T extends object>(
    path: string,
    params: object
  ): Promise<T> {
    this.logs.push({ path, params });
    return {} as T;
  }
  public getLogs(): any[] {
    return this.logs;
  }
}
