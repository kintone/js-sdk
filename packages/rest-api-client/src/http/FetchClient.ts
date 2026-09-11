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
import { platformDeps } from "../platform";

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
    const { method, url, headers, data, responseType, dispatcher, timeout } =
      requestConfig;

    // Computed once and threaded through: Node.js FormData is drained via
    // its own "data"/"end" events, and calling this more than once per
    // request would attach multiple redundant listeners to the same
    // FormData instance.
    const formData =
      data !== undefined ? await platformDeps.buildFetchFormData(data) : null;

    const fetchOptions: RequestInit & { dispatcher?: unknown } = {
      method: method.toUpperCase(),
      headers: this.buildFetchHeaders(headers, data, formData),
    };

    if (data !== undefined) {
      // `Buffer`'s generic `ArrayBufferLike` parameter doesn't structurally
      // satisfy `RequestInit["body"]`'s `ArrayBufferView` under every
      // lib/@types/node combination, even though undici accepts a real
      // Buffer at runtime.
      fetchOptions.body = this.buildFetchBody(
        data,
        formData,
      ) as RequestInit["body"];
    }

    if (dispatcher !== undefined) {
      (fetchOptions as any).dispatcher = dispatcher;
    }

    if (timeout !== undefined) {
      fetchOptions.signal = AbortSignal.timeout(timeout);
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
      response =
        fetchOptions.dispatcher !== undefined
          ? ((await platformDeps.fetchWithDispatcher(
              url,
              fetchOptions,
            )) as globalThis.Response)
          : await fetch(url, fetchOptions as RequestInit);
    } catch (error) {
      if (error instanceof DOMException && error.name === "TimeoutError") {
        throw new FetchClientError(`Request timed out: ${url}`);
      }
      throw new FetchClientError(this.buildFetchErrorMessage(error));
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

  // fetch() wraps the underlying cause (e.g. a TLS "mac verify failure" from a
  // wrong client-cert passphrase) in a generic "fetch failed" TypeError, unlike
  // Axios which surfaced that message directly. Unwrap it so callers matching
  // on the error message (e.g. KintoneResponseHandler's clientCertAuth check)
  // keep working.
  private buildFetchErrorMessage(error: unknown): string {
    if (!(error instanceof Error)) {
      return String(error);
    }
    // `Error.cause` isn't in this package's configured tsconfig `lib`, so read
    // it structurally instead of bumping the lib target for one property.
    const cause = (error as { cause?: unknown }).cause;
    return cause instanceof Error
      ? `${error.message}: ${cause.message}`
      : error.message;
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
    data: unknown,
    formData: Awaited<ReturnType<typeof platformDeps.buildFetchFormData>>,
  ): Record<string, string> {
    const fetchHeaders = { ...headers };

    if (formData) {
      for (const key of Object.keys(fetchHeaders)) {
        if (key.toLowerCase() === "content-type") {
          delete fetchHeaders[key];
        }
      }
      if (formData.contentType) {
        fetchHeaders["Content-Type"] = formData.contentType;
      }
    } else if (data !== undefined && typeof data === "object") {
      fetchHeaders["Content-Type"] = "application/json";
    }

    return fetchHeaders;
  }

  private buildFetchBody(
    data: unknown,
    formData: Awaited<ReturnType<typeof platformDeps.buildFetchFormData>>,
  ): string | globalThis.FormData | Blob {
    if (formData) {
      const { body } = formData;
      // A Buffer body's backing ArrayBuffer gets detached once undici reads
      // it to send the request (observed on Node 22's bundled undici 6.x via
      // FileUploadRedirect.http.test.ts): a 307/308 redirect resend then
      // fails with "Cannot perform ArrayBuffer.prototype.slice on a detached
      // ArrayBuffer" while re-extracting the same body. Wrapping it in a
      // Blob keeps the bytes independently readable across the resend.
      // `Buffer`'s generic `ArrayBufferLike` parameter doesn't structurally
      // satisfy `Blob`'s constructor parameter type under every
      // lib/@types/node combination, even though a real Buffer works fine
      // as Blob content at runtime (see the similar cast below).
      return body instanceof globalThis.FormData
        ? body
        : new Blob([body] as ConstructorParameters<typeof Blob>[0]);
    }
    return JSON.stringify(data);
  }
}
