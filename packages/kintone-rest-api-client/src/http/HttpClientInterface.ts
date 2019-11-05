export type HTTPClientParams = {
  __REQUEST_TOKEN__?: string;
};

export interface HttpClient {
  get: <T extends object>(path: string, params: object) => Promise<T>;
  post: <T extends object>(path: string, params: object) => Promise<T>;
  put: <T extends object>(path: string, params: object) => Promise<T>;
  delete: <T extends object>(path: string, params: object) => Promise<T>;
}
