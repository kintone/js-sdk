import { ErrorResponse, ErrorResponseData } from "./http/HttpClientInterface";

export class KintoneRestAPIError extends Error {
  id: string;
  code: string;
  status: number;
  bulkRequestIndex?: number;
  headers: any;
  errors?: any;

  private static findBulkRequestIndex(results: Array<ErrorResponseData | {}>) {
    for (let i = 0; i < results.length; i++) {
      if (Object.keys(results[i]).length !== 0) {
        return i;
      }
    }

    throw Error(
      "Missing response data in `results`. This error is likely caused by a bug in Kintone REST API Client. Please file an issue."
    );
  }

  private static buildErrorResponseDateWithIndex(error: ErrorResponse) {
    if ("results" in error.data) {
      const bulkRequestIndex = KintoneRestAPIError.findBulkRequestIndex(
        error.data.results
      );
      const data = error.data.results[bulkRequestIndex] as ErrorResponseData;
      return { data, bulkRequestIndex };
    }
    return { data: error.data };
  }

  constructor(error: ErrorResponse) {
    const {
      data,
      bulkRequestIndex
    } = KintoneRestAPIError.buildErrorResponseDateWithIndex(error);

    super(data.message);

    this.name = "KintoneRestAPIError";
    this.id = data.id;
    this.code = data.code;
    this.errors = data.errors;
    this.status = error.status;
    this.bulkRequestIndex = bulkRequestIndex;
    this.headers = error.headers;
    this.message = `[${error.status}] [${this.code}] ${this.message} (${this.id})`;

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KintoneRestAPIError);
    }

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, KintoneRestAPIError.prototype);
  }
}
