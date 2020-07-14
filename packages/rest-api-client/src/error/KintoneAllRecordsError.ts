import { KintoneRestAPIError } from "./KintoneRestAPIError";

export class KintoneAllRecordsError extends Error {
  processedRecordsResult: any;
  unprocessedRecords: any[];
  error: KintoneRestAPIError;
  errorIndex?: number;

  private static parseErrorIndex(errors: { [k: string]: any }) {
    const firstErrorKey = Object.keys(errors)[0];
    const result = firstErrorKey.match(/records\[(\d+)\]/);
    return result ? Number(result[1]) : null;
  }

  private static extractErrorIndex(
    numOfProcessedRecords: number,
    error: KintoneRestAPIError,
    chunkLength: number
  ) {
    if (error.bulkRequestIndex !== undefined && error.errors) {
      const errorParseResult = KintoneAllRecordsError.parseErrorIndex(
        error.errors
      );
      if (errorParseResult !== null) {
        return (
          numOfProcessedRecords +
          error.bulkRequestIndex * chunkLength +
          errorParseResult
        );
      }
    }
    return undefined;
  }

  private static buildErrorMessage(
    numOfProcessedRecords: number,
    numOfAllRecords: number,
    errorIndex: number | undefined
  ) {
    let message = "";
    if (errorIndex !== undefined) {
      message = `An error occurred at records[${errorIndex}]. `;
    }
    message += `${numOfProcessedRecords}/${numOfAllRecords} records are processed successfully`;

    return message;
  }

  constructor(
    processedRecordsResult: any,
    unprocessedRecords: any[],
    numOfAllRecords: number,
    error: KintoneRestAPIError,
    chunkLength: number
  ) {
    const numOfProcessedRecords = numOfAllRecords - unprocessedRecords.length;

    const errorIndex = KintoneAllRecordsError.extractErrorIndex(
      numOfProcessedRecords,
      error,
      chunkLength
    );

    const message = KintoneAllRecordsError.buildErrorMessage(
      numOfProcessedRecords,
      numOfAllRecords,
      errorIndex
    );
    super(message);

    this.name = "KintoneAllRecordsError";
    this.processedRecordsResult = processedRecordsResult;
    this.unprocessedRecords = unprocessedRecords;
    this.error = error;
    this.errorIndex = errorIndex;
    this.message = message;

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, KintoneAllRecordsError.prototype);
  }
}
