import { ErrorResponse, ErrorResponseData } from "./http/HttpClientInterface";

export class KintoneRestAPIError extends Error {
  id: string;
  code: string;
  status: number;
  headers: any;
  errors?: any;

  static buildDataFromBulkRequestResults(
    results: Array<ErrorResponseData | {}>
  ): ErrorResponseData {
    for (const result of results) {
      if (Object.keys(result).length !== 0) {
        return result as ErrorResponseData;
      }
    }

    throw Error(
      "Missing response data in `results`. This error is likely caused by a bug in Kintone REST API Client. Please file an issue."
    );
  }

  constructor(error: ErrorResponse) {
    const data =
      "results" in error.data
        ? KintoneRestAPIError.buildDataFromBulkRequestResults(
            error.data.results
          )
        : error.data;

    super(data.message);

    this.name = "KintoneRestAPIError";
    this.id = data.id;
    this.code = data.code;
    this.errors = data.errors;
    this.status = error.status;
    this.headers = error.headers;
    this.message = `[${error.status}] [${this.code}] ${this.message} (${this.id})`;

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KintoneRestAPIError);
    }
  }
}
