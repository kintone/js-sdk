import { KintoneRestAPIError } from "../KintoneRestAPIError";

describe("KintoneRestAPIError", () => {
  describe("constructor", () => {
    it("should set properties from an error", () => {
      const errorResponse = {
        data: {
          id: "some id",
          code: "some code",
          message: "some error message",
          errors: [
            {
              key: {
                messages: ["key is missing"],
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
      const kintoneRestAPIError = new KintoneRestAPIError(errorResponse);
      expect(kintoneRestAPIError.name).toBe("KintoneRestAPIError");
      expect(kintoneRestAPIError.code).toBe(errorResponse.data.code);
      expect(kintoneRestAPIError.errors).toEqual(errorResponse.data.errors);
      expect(kintoneRestAPIError.status).toBe(errorResponse.status);
      expect(kintoneRestAPIError.bulkRequestIndex).toBe(undefined);
      expect(kintoneRestAPIError.headers).toEqual(errorResponse.headers);
      expect(kintoneRestAPIError.message).toBe(
        `[${errorResponse.status}] [${errorResponse.data.code}] ${errorResponse.data.message} (${errorResponse.data.id})`,
      );
    });
    it("should set properties from an BulkRequest error", () => {
      const errorResponseData = {
        id: "some id",
        code: "some code",
        message: "some error message",
        errors: [
          {
            key: {
              messages: ["key is missing"],
            },
          },
        ],
      };

      const errorResponse = {
        data: {
          results: [{}, {}, errorResponseData, {}],
        },
        status: 500,
        statusText: "Internal Server Error",
        headers: {
          "X-Some-Header": "error",
        },
      };
      const kintoneRestAPIError = new KintoneRestAPIError(errorResponse);
      expect(kintoneRestAPIError.name).toBe("KintoneRestAPIError");
      expect(kintoneRestAPIError.code).toBe(errorResponseData.code);
      expect(kintoneRestAPIError.errors).toEqual(errorResponseData.errors);
      expect(kintoneRestAPIError.status).toBe(errorResponse.status);
      expect(kintoneRestAPIError.headers).toEqual(errorResponse.headers);
      expect(kintoneRestAPIError.bulkRequestIndex).toEqual(2);
      expect(kintoneRestAPIError.message).toBe(
        `[${errorResponse.status}] [${errorResponseData.code}] ${errorResponseData.message} (${errorResponseData.id})`,
      );
    });
    it("should throw an error if there is no error object in the results", () => {
      const errorResponse = {
        data: {
          results: [{}, {}, {}],
        },
        status: 500,
        statusText: "Internal Server Error",
        headers: {
          "X-Some-Header": "error",
        },
      };
      expect(() => {
        new KintoneRestAPIError(errorResponse);
      }).toThrow(
        "Missing response data in `results`. This error is likely caused by a bug in Kintone REST API Client. Please file an issue.",
      );
    });
  });
});
