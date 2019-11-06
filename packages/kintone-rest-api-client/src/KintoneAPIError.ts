type ErrorResponse = {
  data: any;
  status: string;
  headers: object;
  message: string;
};

export class KintoneAPIError extends Error {
  name = "KintoneAPIError";
  data: object;
  status: string;
  headers: object;

  constructor(error: ErrorResponse) {
    super(error.data.message);

    this.data = error.data;
    this.status = error.status;
    this.headers = error.headers;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KintoneAPIError);
    }
  }
}
