import type FormData from "form-data";
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

export type Response<T = any> = {
  data: T;
  headers: any;
};

export type HttpMethod = "get" | "post" | "put" | "delete";
export type Params = { [key: string]: unknown };

export type ProxyConfig =
  | {
      protocol?: string;
      host: string;
      port: number;
      auth?: {
        username: string;
        password: string;
      };
    }
  | false;

export interface HttpClientError<T = ErrorResponse> extends Error {
  response?: T;
}
export interface ResponseHandler {
  handle: <T = any>(response: Promise<Response<T>>) => Promise<T>;
}

export type RequestConfig = {
  method: HttpMethod;
  url: string;
  headers: any;
  httpsAgent?: any;
  data?: any;
  proxy?: ProxyConfig;
};

export interface RequestConfigBuilder {
  build: (
    method: HttpMethod,
    path: string,
    params: Params | FormData,
    options?: { responseType: "arraybuffer" }
  ) => Promise<RequestConfig>;
}
