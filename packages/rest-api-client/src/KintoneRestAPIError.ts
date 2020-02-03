import { ErrorResponse, ErrorResponseData } from "./http/HttpClientInterface";

export class KintoneRestAPIError extends Error {
  id: string;
  code: string;
  status: number;
  bulkRequestIndex?: number;
  headers: any;
  errors?: any;

  static findBulkRequestIndex(results: Array<ErrorResponseData | {}>) {
    for (let i = 0; i < results.length; i++) {
      if (Object.keys(results[i]).length !== 0) {
        return i;
      }
    }

    throw Error(
      "Missing response data in `results`. This error is likely caused by a bug in Kintone REST API Client. Please file an issue."
    );
  }

  constructor(error: ErrorResponse) {
    let data;
    let bulkRequestIndex;
    if ("results" in error.data) {
      bulkRequestIndex = KintoneRestAPIError.findBulkRequestIndex(
        error.data.results
      );
      data = error.data.results[bulkRequestIndex] as ErrorResponseData;
    } else {
      data = error.data;
    }

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
  }
}
