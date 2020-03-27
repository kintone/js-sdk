import FormData from "form-data";
import qs from "qs";

import {
  RequestConfigBuilder,
  RequestConfig,
  HttpMethod,
  Params,
} from "./http/HttpClientInterface";
import { KintoneAuthHeader, HTTPClientParams } from "./KintoneRestAPIClient";

const THRESHOLD_AVOID_REQUEST_URL_TOO_LARGE = 4096;

export class KintoneRequestConfigBuilder implements RequestConfigBuilder {
  private baseUrl: string;
  private headers: KintoneAuthHeader;
  private params: HTTPClientParams;
  constructor(
    baseUrl: string,
    headers: KintoneAuthHeader,
    params: HTTPClientParams
  ) {
    this.baseUrl = baseUrl;
    this.headers = headers;
    this.params = params;
  }
  public build(
    method: HttpMethod,
    path: string,
    params: Params | FormData,
    options?: { responseType: "arraybuffer" }
  ) {
    const requestConfig: RequestConfig = {
      method,
      headers: this.headers,
      url: `${this.baseUrl}${path}`,
      ...(options ? options : {}),
    };

    switch (method) {
      case "get": {
        const requestUrl = this.buildRequestUrl(path, params);
        if (requestUrl.length > THRESHOLD_AVOID_REQUEST_URL_TOO_LARGE) {
          return {
            ...requestConfig,
            method: "post" as const,
            headers: { ...this.headers, "X-HTTP-Method-Override": "GET" },
            data: { ...this.params, ...params },
          };
        }
        return {
          ...requestConfig,
          url: requestUrl,
        };
      }
      case "post": {
        if (params instanceof FormData) {
          const formData = params;
          Object.keys(this.params).forEach((key) => {
            formData.append(key, (this.params as any)[key]);
          });
          return {
            ...requestConfig,
            headers:
              typeof formData.getHeaders === "function"
                ? { ...this.headers, ...formData.getHeaders() }
                : this.headers,
            data: formData,
          };
        }
        return {
          ...requestConfig,
          data: { ...this.params, ...params },
        };
      }
      case "put": {
        return {
          ...requestConfig,
          data: { ...this.params, ...params },
        };
      }
      case "delete": {
        const requestUrl = this.buildRequestUrl(path, {
          ...this.params,
          ...params,
        });
        return {
          ...requestConfig,
          url: requestUrl,
        };
      }
      default: {
        throw new Error(`${method} method is not supported`);
      }
    }
  }
  // FIXME: this doesn't add this.params on the query
  // because this.params is for __REQUEST_TOKEN__.
  // But it depends on what this.params includes.
  // we should consider to rename this.params.
  private buildRequestUrl(path: string, params: Params | FormData): string {
    return `${this.baseUrl}${path}?${qs.stringify(params)}`;
  }
}
