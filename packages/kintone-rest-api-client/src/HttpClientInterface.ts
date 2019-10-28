export interface HttpClient {
  get: <T extends object>(path: string, params: object) => Promise<T>;
}
