import { HttpClient } from "./HttpClientInterface";

export class MockClient implements HttpClient {
  public async get<T extends object>(path: string, params: object): Promise<T> {
    return {} as T;
  }
  public async post<T extends object>(
    path: string,
    params: object
  ): Promise<T> {
    return {} as T;
  }
  public async put<T extends object>(path: string, params: object): Promise<T> {
    return {} as T;
  }
  public async delete<T extends object>(
    path: string,
    params: object
  ): Promise<T> {
    return {} as T;
  }
}
