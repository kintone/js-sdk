import { ErrorResponse } from "../http/HttpClientInterface";

type SingleErrorResponseData = {
  id: string;
  code: string;
  message: string;
  errors?: any;
};

type BulkRequestErrorResponseData = {
  results: Array<SingleErrorResponseData | {}>;
};

type KintoneErrorResponseData =
  | SingleErrorResponseData
  | BulkRequestErrorResponseData;

export type KintoneErrorResponse = ErrorResponse<KintoneErrorResponseData>;

export class KintoneRestAPIError extends Error {
  id: string;
  code: string;
  status: number;
  bulkRequestIndex?: number;
  headers: any;
  errors?: any;

  private static findErrorResponseDataWithIndex(
    results: BulkRequestErrorResponseData["results"]
  ) {
    for (let i = 0; i < results.length; i++) {
      if (Object.keys(results[i]).length !== 0) {
        const data = results[i] as SingleErrorResponseData;
        return { data, bulkRequestIndex: i };
      }
    }

    throw Error(
      "Missing response data in `results`. This error is likely caused by a bug in Kintone REST API Client. Please file an issue."
    );
  }

  private static buildErrorResponseDateWithIndex(error: KintoneErrorResponse): {
    data: SingleErrorResponseData;
    bulkRequestIndex?: number;
  } {
    if ("results" in error.data) {
      return KintoneRestAPIError.findErrorResponseDataWithIndex(
        error.data.results
      );
    }
    return { data: error.data };
  }

  constructor(error: KintoneErrorResponse) {
    const { data, bulkRequestIndex } =
      KintoneRestAPIError.buildErrorResponseDateWithIndex(error);

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
