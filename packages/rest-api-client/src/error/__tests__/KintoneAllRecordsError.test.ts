import { KintoneAllRecordsError } from "../KintoneAllRecordsError";
import { KintoneRestAPIError } from "../KintoneRestAPIError";
import { ErrorResponse } from "../../http/HttpClientInterface";

describe("KintoneAllRecordsError", () => {
  let kintoneAllRecordsError: KintoneAllRecordsError;
  let kintoneRestApiError: KintoneRestAPIError;
  let errorResponse: ErrorResponse;
  const processedRecordsResult = { records: [{}, {}, {}, {}, {}] };
  const unprocessedRecords = [{}, {}, {}];
  const numOfAllRecords = 8;
  const numOfProcessedRecords = numOfAllRecords - unprocessedRecords.length;
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
                messages: ["key is missing"],
              },
            },
          },
        ],
      },
      status: 500,
      statusText: "Internal Server Error",
      headers: {
        "X-Some-Header": "error",
      },
    };
    kintoneRestApiError = new KintoneRestAPIError(errorResponse);
    kintoneAllRecordsError = new KintoneAllRecordsError(
      processedRecordsResult,
      unprocessedRecords,
      numOfAllRecords,
      kintoneRestApiError,
      chunkLength
    );
  });
  describe("constructor", () => {
    it("should set errorIndex from an error", () => {
      expect(kintoneAllRecordsError.errorIndex).toBe(
        numOfProcessedRecords +
          bulkRequestIndex * chunkLength +
          errorParseResult
      );
    });
    it("should set processedRecordsResult, unprocessedRecords, numOfAllRecords, numOfProcessedRecords, and error properties", () => {
      expect(kintoneAllRecordsError.processedRecordsResult).toStrictEqual(
        processedRecordsResult
      );
      expect(kintoneAllRecordsError.unprocessedRecords).toStrictEqual(
        unprocessedRecords
      );
      expect(kintoneAllRecordsError.numOfAllRecords).toStrictEqual(
        numOfAllRecords
      );
      expect(kintoneAllRecordsError.numOfProcessedRecords).toStrictEqual(
        numOfProcessedRecords
      );
      expect(kintoneAllRecordsError.error).toStrictEqual(kintoneRestApiError);
    });
    it("should set a message that includes an error index if error.errors exists", () => {
      expect(kintoneAllRecordsError.message).toBe(
        `An error occurred at records[${kintoneAllRecordsError.errorIndex}]. ${numOfProcessedRecords}/${numOfAllRecords} records are processed successfully`
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
                  messages: ["key is missing"],
                },
              },
            },
          ],
        },
        status: 500,
        statusText: "Internal Server Error",
        headers: {
          "X-Some-Header": "error",
        },
      };
      kintoneRestApiError = new KintoneRestAPIError(errorResponse);
      kintoneAllRecordsError = new KintoneAllRecordsError(
        processedRecordsResult,
        unprocessedRecords,
        numOfAllRecords,
        kintoneRestApiError,
        chunkLength
      );

      expect(kintoneAllRecordsError.message).toBe(
        `${numOfProcessedRecords}/${numOfAllRecords} records are processed successfully`
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
                  messages: ["key is missing"],
                },
              },
            },
            {},
            {},
          ],
        },
        status: 500,
        statusText: "Internal Server Error",
        headers: {
          "X-Some-Header": "error",
        },
      };
      kintoneRestApiError = new KintoneRestAPIError(errorResponse);
      kintoneAllRecordsError = new KintoneAllRecordsError(
        processedRecordsResult,
        unprocessedRecords,
        numOfAllRecords,
        kintoneRestApiError,
        chunkLength
      );

      expect(kintoneAllRecordsError.errorIndex).toBe(
        numOfProcessedRecords + errorParseResult
      );
    });
    it("should set errorIndex as the smallest value from the response errors", () => {
      const largerErrorIndex = 9;
      const smallestErrorIndex = 5;
      errorResponse = {
        data: {
          results: [
            {
              id: "some id",
              code: "some code",
              message: "some error message",
              errors: {
                [`records[${largerErrorIndex}].Customer`]: {
                  messages: ["key is missing"],
                },
                [`records[${smallestErrorIndex}].Customer`]: {
                  messages: ["key is missing"],
                },
              },
            },
            {},
            {},
          ],
        },
        status: 500,
        statusText: "Internal Server Error",
        headers: {
          "X-Some-Header": "error",
        },
      };
      kintoneRestApiError = new KintoneRestAPIError(errorResponse);
      kintoneAllRecordsError = new KintoneAllRecordsError(
        processedRecordsResult,
        unprocessedRecords,
        numOfAllRecords,
        kintoneRestApiError,
        chunkLength
      );

      expect(kintoneAllRecordsError.errorIndex).toBe(
        numOfProcessedRecords + smallestErrorIndex
      );
    });
  });
});
