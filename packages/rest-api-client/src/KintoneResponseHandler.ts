import {
  ErrorResponse,
  HttpClientError,
  Response,
  ResponseHandler,
} from "./http/HttpClientInterface";
import { KintoneAbortedSearchResultError } from "./error/KintoneAbortedSearchResultError";
import {
  KintoneRestAPIError,
  KintoneErrorResponse,
} from "./error/KintoneRestAPIError";

export class KintoneResponseHandler implements ResponseHandler {
  private enableAbortedSearchResultError: boolean;
  constructor({
    enableAbortedSearchResultError,
  }: {
    enableAbortedSearchResultError: boolean;
  }) {
    this.enableAbortedSearchResultError = enableAbortedSearchResultError;
  }
  handle<T>(response: Promise<Response<T>>): Promise<T> {
    return response.then(
      (res) => this.successResponseHandler<T>(res),
      (error) => this.errorResponseHandler(error)
    );
  }
  private successResponseHandler<T>(response: Response<T>): T {
    if (
      this.enableAbortedSearchResultError &&
      /Filter aborted because of too many search results/.test(
        response.headers["x-cybozu-warning"]
      )
    ) {
      throw new KintoneAbortedSearchResultError(
        response.headers["x-cybozu-warning"]
      );
    }
    return response.data;
  }
  private errorResponseHandler(
    error: HttpClientError<ErrorResponse<string> | KintoneErrorResponse>
  ): never {
    if (!error.response) {
      // FIXME: find a better way to handle this error
      if (/mac verify failure/.test(error.toString())) {
        throw new Error("invalid clientCertAuth setting");
      }
      throw error;
    }
    const errorResponse = error.response;

    const { data, ...rest } = errorResponse;
    if (typeof data === "string") {
      throw new Error(`${rest.status}: ${rest.statusText}`);
    }
    throw new KintoneRestAPIError({ data, ...rest });
  }
}
