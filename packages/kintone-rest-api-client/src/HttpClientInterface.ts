export interface HttpClient {
  request: (path: string, params: object) => any;
}
