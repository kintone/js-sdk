import { KintoneAllRecordsError } from "../KintoneAllRecordsError";
import { KintoneRestAPIError } from "../KintoneRestAPIError";
import { ErrorResponse } from "../http/HttpClientInterface";

describe("KintoneAllRecordsError", () => {
  let kintoneAllRecordsError: KintoneAllRecordsError;
  let kintoneRestApiError: KintoneRestAPIError;
  let errorResponse: ErrorResponse;
  const processedRecordsResult = [{}, {}, {}, {}, {}];
  const unprocessedRecords = [{}, {}, {}];
  const chunkLength = 100;
  // ref. errorResponse.data.results
  const bulkRequestIndex = 2;
  const errorParseResult = 5;
  beforeEach(() => {
    errorResponse = {
      data: {
        results: [
          {},
          {},
          {
            id: "some id",
            code: "some code",
            message: "some error message",
            errors: {
              [`records[${errorParseResult}].Customer`]: {
                messages: ["key is missing"]
              }
            }
          }
        ]
      },
      status: 500,
      headers: {
        "X-Some-Header": "error"
      }
    };
    kintoneRestApiError = new KintoneRestAPIError(errorResponse);
    kintoneAllRecordsError = new KintoneAllRecordsError(
      processedRecordsResult,
      unprocessedRecords,
      kintoneRestApiError,
      chunkLength
    );
  });
  describe("constructor", () => {
    it("should set errorIndex from an error", () => {
      expect(kintoneAllRecordsError.errorIndex).toBe(
        processedRecordsResult.length +
          bulkRequestIndex * chunkLength +
          errorParseResult
      );
    });
    it("should set processedRecordsResult, unprocessedRecords, and error properties", () => {
      expect(kintoneAllRecordsError.processedRecordsResult).toStrictEqual(
        processedRecordsResult
      );
      expect(kintoneAllRecordsError.unprocessedRecords).toStrictEqual(
        unprocessedRecords
      );
      expect(kintoneAllRecordsError.error).toStrictEqual(kintoneRestApiError);
    });
    it("should set a message that includes an error index if error.errors exists", () => {
      expect(kintoneAllRecordsError.message).toBe(
        `An error occurred at records[${kintoneAllRecordsError.errorIndex}]. ${
          processedRecordsResult.length
        }/${processedRecordsResult.length +
          unprocessedRecords.length} records are processed successfully`
      );
    });
    it("should set a message that includes the succeeded count", () => {
      errorResponse = {
        data: {
          results: [
            {},
            {},
            {
              id: "some id",
              code: "some code",
              message: "some error message",
              errors: {
                unexpectedKey: {
                  messages: ["key is missing"]
                }
              }
            }
          ]
        },
        status: 500,
        headers: {
          "X-Some-Header": "error"
        }
      };
      kintoneRestApiError = new KintoneRestAPIError(errorResponse);
      kintoneAllRecordsError = new KintoneAllRecordsError(
        processedRecordsResult,
        unprocessedRecords,
        kintoneRestApiError,
        chunkLength
      );

      expect(kintoneAllRecordsError.message).toBe(
        `${processedRecordsResult.length}/${processedRecordsResult.length +
          unprocessedRecords.length} records are processed successfully`
      );
    });
    it("should set errorIndex even if bulkRequestIndex = 0", () => {
      errorResponse = {
        data: {
          results: [
            {
              id: "some id",
              code: "some code",
              message: "some error message",
              errors: {
                [`records[${errorParseResult}].Customer`]: {
                  messages: ["key is missing"]
                }
              }
            },
            {},
            {}
          ]
        },
        status: 500,
        headers: {
          "X-Some-Header": "error"
        }
      };
      kintoneRestApiError = new KintoneRestAPIError(errorResponse);
      kintoneAllRecordsError = new KintoneAllRecordsError(
        processedRecordsResult,
        unprocessedRecords,
        kintoneRestApiError,
        chunkLength
      );

      expect(kintoneAllRecordsError.errorIndex).toBe(
        processedRecordsResult.length + errorParseResult
      );
    });
  });
});
