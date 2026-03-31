import type {
  HttpClient,
  RequestConfigBuilder,
  RequestConfig,
  ResponseHandler,
  Response,
  ErrorResponse,
  HttpClientError,
} from "./HttpClientInterface";
import type FormData from "form-data";
// Note: FormData from form-data package is used for Node.js
// Browser uses native FormData

class FetchClientError extends Error implements HttpClientError<ErrorResponse> {
  response?: ErrorResponse;

  constructor(message: string, response?: ErrorResponse) {
    super(message);
    this.name = "FetchClientError";
    this.response = response;
  }
}

export class FetchClient implements HttpClient {
  private responseHandler: ResponseHandler;
  private requestConfigBuilder: RequestConfigBuilder;

  constructor({
    responseHandler,
    requestConfigBuilder,
  }: {
    responseHandler: ResponseHandler;
    requestConfigBuilder: RequestConfigBuilder;
  }) {
    this.responseHandler = responseHandler;
    this.requestConfigBuilder = requestConfigBuilder;
  }

  public async get<T extends object>(path: string, params: any) {
    const requestConfig = await this.requestConfigBuilder.build(
      "get",
      path,
      params,
    );
    return (await this.sendRequest(requestConfig)) as Promise<T>;
  }

  public async getData(path: string, params: any) {
    const requestConfig = await this.requestConfigBuilder.build(
      "get",
      path,
      params,
      {
        responseType: "arraybuffer",
      },
    );
    return (await this.sendRequest(requestConfig)) as Promise<ArrayBuffer>;
  }

  public async post<T extends object>(path: string, params: any) {
    const requestConfig = await this.requestConfigBuilder.build(
      "post",
      path,
      params,
    );
    return (await this.sendRequest(requestConfig)) as Promise<T>;
  }

  public async postData<T extends object>(path: string, formData: FormData) {
    const requestConfig = await this.requestConfigBuilder.build(
      "post",
      path,
      formData,
    );
    return (await this.sendRequest(requestConfig)) as Promise<T>;
  }

  public async put<T extends object>(path: string, params: any) {
    const requestConfig = await this.requestConfigBuilder.build(
      "put",
      path,
      params,
    );
    return (await this.sendRequest(requestConfig)) as Promise<T>;
  }

  public async delete<T extends object>(path: string, params: any) {
    const requestConfig = await this.requestConfigBuilder.build(
      "delete",
      path,
      params,
    );
    return (await this.sendRequest(requestConfig)) as Promise<T>;
  }

  private async sendRequest(requestConfig: RequestConfig): Promise<unknown> {
    const { method, url, headers, data, responseType, dispatcher } =
      requestConfig;

    const fetchOptions: RequestInit & { dispatcher?: unknown } = {
      method: method.toUpperCase(),
      headers: this.buildFetchHeaders(headers, data),
    };

    if (data !== undefined) {
      fetchOptions.body = this.buildFetchBody(data);
    }

    // Node.js: undici dispatcher for proxy/TLS support
    if (dispatcher !== undefined) {
      (fetchOptions as any).dispatcher = dispatcher;
    }

    const responsePromise = this.executeFetch(url, fetchOptions, responseType);
    return this.responseHandler.handle(responsePromise);
  }

  private async executeFetch(
    url: string,
    fetchOptions: RequestInit & { dispatcher?: unknown },
    responseType?: string,
  ): Promise<Response> {
    let response: globalThis.Response;
    try {
      response = await fetch(url, fetchOptions as RequestInit);
    } catch (error) {
      throw new FetchClientError(
        error instanceof Error ? error.message : String(error),
      );
    }

    if (!response.ok) {
      const errorResponse = await this.buildErrorResponse(response);
      throw new FetchClientError(response.statusText, errorResponse);
    }

    return this.buildSuccessResponse(response, responseType);
  }

  private async buildSuccessResponse(
    response: globalThis.Response,
    responseType?: string,
  ): Promise<Response> {
    const headers = this.convertHeaders(response.headers);

    let data: unknown;
    if (responseType === "arraybuffer") {
      data = await response.arrayBuffer();
    } else {
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = text;
      }
    }

    return { data, headers };
  }

  private async buildErrorResponse(
    response: globalThis.Response,
  ): Promise<ErrorResponse> {
    const headers = this.convertHeaders(response.headers);

    let data: unknown;
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }
    } else {
      data = await response.text();
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers,
    };
  }

  private convertHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key.toLowerCase()] = value;
    });
    return result;
  }

  private buildFetchHeaders(
    headers: Record<string, string>,
    data?: unknown,
  ): Record<string, string> {
    const fetchHeaders = { ...headers };

    // FormData: let fetch set Content-Type automatically (with boundary)
    if (this.isFormData(data)) {
      delete fetchHeaders["Content-Type"];
    } else if (data !== undefined && typeof data === "object") {
      fetchHeaders["Content-Type"] = "application/json";
    }

    return fetchHeaders;
  }

  private buildFetchBody(data: unknown): string | globalThis.FormData {
    if (this.isFormData(data)) {
      // Node.js form-data package or browser FormData
      return data as globalThis.FormData;
    }
    return JSON.stringify(data);
  }

  private isFormData(data: unknown): boolean {
    if (!data || typeof data !== "object") {
      return false;
    }
    // Node.js form-data package has getHeaders method
    if (
      "getHeaders" in data &&
      typeof (data as any).getHeaders === "function"
    ) {
      return true;
    }
    // Browser FormData - check constructor name to avoid typeof issues
    if (data.constructor && data.constructor.name === "FormData") {
      return true;
    }
    return false;
  }
}
