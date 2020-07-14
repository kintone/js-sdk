import { KintoneRestAPIClient, responseHandler } from "../KintoneRestAPIClient";
import { injectPlatformDeps } from "../platform";
import * as browserDeps from "../platform/browser";
import { KintoneRestAPIError } from "../error/KintoneRestAPIError";
import { KintoneAbortedSearchResultError } from "../error/KintoneAbortedSearchResultError";
import {
  ErrorResponse,
  Response,
  HttpClientError,
} from "../http/HttpClientInterface";

describe("KintoneRestAPIClient", () => {
  describe("constructor", () => {
    let originalKintone: any;
    let originalLocation: any;
    beforeEach(() => {
      originalKintone = global.kintone;
      originalLocation = global.location;
      global.kintone = {
        getRequestToken: () => "dummy request token",
      };
      global.location = {
        host: "example.com",
        protocol: "https:",
      };
    });
    afterEach(() => {
      global.kintone = originalKintone;
      global.location = originalLocation;
    });
    describe("Header", () => {
      const baseUrl = "https://example.com";
      it("should use a location object in browser environment if baseUrl param is not specified", () => {
        injectPlatformDeps(browserDeps);
        const client = new KintoneRestAPIClient();
        expect(client.getBaseUrl()).toBe("https://example.com");
      });

      it("should raise an error in Node.js environment if baseUrl param is not specified", () => {
        const USERNAME = "user";
        const PASSWORD = "password";
        const auth = {
          username: USERNAME,
          password: PASSWORD,
        };
        expect(() => new KintoneRestAPIClient({ auth })).toThrow(
          "in Node.js environment, baseUrl is required"
        );
      });
      it("should raise an error if trying to use session auth in Node.js environment", () => {
        expect(() => {
          new KintoneRestAPIClient({
            baseUrl,
          });
        }).toThrow(
          "session authentication is not supported in Node.js environment."
        );
      });
    });
  });

  describe("version", () => {
    it("should provide this library version", () => {
      expect(KintoneRestAPIClient.version).toBe(
        require("../../package.json").version
      );
    });
  });

  describe("responseHandler", () => {
    class HttpClientErrorImpl<T> extends Error implements HttpClientError<T> {
      public response?: T;

      constructor(message: string, response?: T) {
        super(message);
        this.response = response;
      }
    }
    it("should throw an error if x-cybozu-warning is'Filter aborted because of too many search results'", () => {
      const response: Response = {
        data: { status: "success" },
        headers: {
          "x-cybozu-warning":
            "Filter aborted because of too many search results",
        },
      };
      return expect(responseHandler(Promise.resolve(response))).rejects.toThrow(
        KintoneAbortedSearchResultError
      );
    });
    it("should raise a KintoneRestAPIError", () => {
      const errorResponse: ErrorResponse = {
        data: {},
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
      };
      expect(
        responseHandler(
          Promise.reject(new HttpClientErrorImpl("", errorResponse))
        )
      ).rejects.toThrow(KintoneRestAPIError);
    });
    it("should raise an Error if error.response.data is a string", () => {
      const errorResponse: ErrorResponse = {
        data: "unexpected error",
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
      };
      expect(
        responseHandler(
          Promise.reject(new HttpClientErrorImpl("", errorResponse))
        )
      ).rejects.toThrow(`${errorResponse.status}: ${errorResponse.statusText}`);
    });
    it("should raise an error if error.response is undefined", () => {
      expect(
        responseHandler(
          Promise.reject(new HttpClientErrorImpl("unknown error"))
        )
      ).rejects.toThrow("unknown error");
    });
    it("should raise an error with appropriate message if the error is 'mac verify failure'", () => {
      expect(
        responseHandler(
          Promise.reject(new HttpClientErrorImpl("mac verify failure"))
        )
      ).rejects.toThrow("invalid clientCertAuth setting");
    });
  });
});
