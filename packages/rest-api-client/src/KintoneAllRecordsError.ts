import { KintoneRestAPIError } from "./KintoneRestAPIError";

export class KintoneAllRecordsError extends Error {
  processedRecordsResult: object[];
  unprocessedRecords: object[];
  error: KintoneRestAPIError;
  errorIndex?: number;

  private static parseErrorIndex(errors: { [k: string]: any }) {
    const firstErrorKey = Object.keys(errors)[0];
    const result = firstErrorKey.match(/records\[(\d+)\]/);
    return result ? Number(result[1]) : null;
  }

  private static extractErrorIndex(
    error: KintoneRestAPIError,
    processedRecordsResult: object[],
    chunkLength: number
  ) {
    if (error.bulkRequestIndex !== undefined && error.errors) {
      const errorParseResult = KintoneAllRecordsError.parseErrorIndex(
        error.errors
      );
      if (errorParseResult !== null) {
        return (
          processedRecordsResult.length +
          error.bulkRequestIndex * chunkLength +
          errorParseResult
        );
      }
    }
    return undefined;
  }

  private static buildErrorMessage(
    processedRecordsResult: object[],
    unprocessedRecords: object[],
    errorIndex: number | undefined
  ) {
    let message = "";
    if (errorIndex !== undefined) {
      message = `An error occurred at records[${errorIndex}]. `;
    }
    message += `${
      processedRecordsResult.length
    }/${processedRecordsResult.length +
      unprocessedRecords.length} records are processed successfully`;

    return message;
  }

  constructor(
    processedRecordsResult: object[],
    unprocessedRecords: object[],
    error: KintoneRestAPIError,
    chunkLength: number
  ) {
    const errorIndex = KintoneAllRecordsError.extractErrorIndex(
      error,
      processedRecordsResult,
      chunkLength
    );

    const message = KintoneAllRecordsError.buildErrorMessage(
      processedRecordsResult,
      unprocessedRecords,
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
