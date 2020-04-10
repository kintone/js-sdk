import FormData from "form-data";
export interface HttpClient {
  get: <T extends object>(path: string, params: object) => Promise<T>;
  getData: (path: string, params: object) => Promise<ArrayBuffer>;
  post: <T extends object>(path: string, params: object) => Promise<T>;
  postData: <T extends object>(path: string, params: FormData) => Promise<T>;
  put: <T extends object>(path: string, params: object) => Promise<T>;
  delete: <T extends object>(path: string, params: object) => Promise<T>;
}

export type ErrorResponse<T = any> = {
  data: T;
  status: number;
  statusText: string;
  headers: any;
};

export type HttpMethod = "get" | "post" | "put" | "delete";
export type Params = { [key: string]: unknown };

export class HttpError<T = ErrorResponse> extends Error {
  public response?: T;

  constructor(message: string, response?: T) {
    super(message);
    this.response = response;
  }
}
export type ErrorResponseHandler = (error: HttpError) => void;

export type RequestConfig = {
  method: HttpMethod;
  url: string;
  headers: any;
  httpsAgent?: any;
  data?: any;
};

export interface RequestConfigBuilder {
  build: (
    method: HttpMethod,
    path: string,
    params: Params | FormData,
    options?: { responseType: "arraybuffer" }
  ) => RequestConfig;
}
