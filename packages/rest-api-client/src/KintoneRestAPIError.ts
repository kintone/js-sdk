type ErrorResponse = {
  data: {
    id: string;
    code: string;
    message: string;
    errors?: any;
  };
  status: number;
  headers: any;
};

export class KintoneRestAPIError extends Error {
  id: string;
  code: string;
  status: number;
  headers: any;

  constructor(error: ErrorResponse) {
    super(error.data.message);

    this.name = "KintoneRestAPIError";
    this.id = error.data.id;
    this.code = error.data.code;
    this.status = error.status;
    this.headers = error.headers;
    this.message = `[${error.status}] [${error.data.code}] ${error.data.message} (${error.data.id}) `;

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KintoneRestAPIError);
    }
  }
}
