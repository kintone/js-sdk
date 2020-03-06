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

  constructor(
    processedRecordsResult: object[],
    unprocessedRecords: object[],
    error: KintoneRestAPIError
  ) {
    super("foobar");
    this.processedRecordsResult = processedRecordsResult;
    this.unprocessedRecords = unprocessedRecords;
    this.error = error;
    const errorParseResult = KintoneAllRecordsError.parseErrorIndex(
      error.errors
    );
    if (error.bulkRequestIndex && error.errors && errorParseResult) {
      this.errorIndex =
        processedRecordsResult.length +
        error.bulkRequestIndex * 100 +
        errorParseResult;
    }
  }
}
