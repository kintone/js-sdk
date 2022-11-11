import type {
  ErrorResponse,
  HttpClientError,
  Response,
  ResponseHandler,
} from "./http/HttpClientInterface";
import { KintoneAbortSearchError } from "./error/KintoneAbortSearchError";
import type { KintoneErrorResponse } from "./error/KintoneRestAPIError";
import { KintoneRestAPIError } from "./error/KintoneRestAPIError";

export class KintoneResponseHandler implements ResponseHandler {
  private enableAbortSearchError: boolean;
  constructor({ enableAbortSearchError }: { enableAbortSearchError: boolean }) {
    this.enableAbortSearchError = enableAbortSearchError;
  }
  handle<T>(response: Promise<Response<T>>): Promise<T> {
    return response.then(
      (res) => this.handleSuccessResponse<T>(res),
      (error) => this.handleErrorResponse(error)
    );
  }
  private handleSuccessResponse<T>(response: Response<T>): T {
    if (
      this.enableAbortSearchError &&
      /Filter aborted because of too many search results/.test(
        response.headers["x-cybozu-warning"]
      )
    ) {
      throw new KintoneAbortSearchError(response.headers["x-cybozu-warning"]);
    }
    return response.data;
  }
  private handleErrorResponse(
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
