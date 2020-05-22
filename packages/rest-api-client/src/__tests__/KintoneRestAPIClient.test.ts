import {
  KintoneRestAPIClient,
  errorResponseHandler,
} from "../KintoneRestAPIClient";
import { injectPlatformDeps } from "../platform";
import * as browserDeps from "../platform/browser";
import * as nodeDeps from "../platform/node";
import { KintoneRestAPIError } from "../KintoneRestAPIError";
import { ErrorResponse, HttpClientError } from "../http/HttpClientInterface";

describe("KintoneRestAPIClient", () => {
  describe("constructor", () => {
    let originalKintone: any;
    beforeEach(() => {
      originalKintone = global.kintone;
      global.kintone = {
        getRequestToken: () => "dummy request token",
      };
    });
    afterEach(() => {
      global.kintone = originalKintone;
    });
    describe("Header", () => {
      const baseUrl = "https://example.com";
      beforeEach(() => {
        injectPlatformDeps(browserDeps);
      });

      it("should use location.origin in browser environment if baseUrl param is not specified", () => {
        global.location = {
          origin: "https://example.com",
        };
        const client = new KintoneRestAPIClient();
        expect(client.getBaseUrl()).toBe("https://example.com");
      });

      it("should raise an error in Node.js environment if baseUrl param is not specified", () => {
        global.location = undefined;
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
        injectPlatformDeps(nodeDeps);
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
  describe("errorResponseHandler", () => {
    class HttpClientErrorImpl<T> extends Error implements HttpClientError<T> {
      public response?: T;

      constructor(message: string, response?: T) {
        super(message);
        this.response = response;
      }
    }
    it("should raise a KintoneRestAPIError", () => {
      const errorResponse: ErrorResponse = {
        data: {},
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
      };
      expect(() => {
        errorResponseHandler(new HttpClientErrorImpl("", errorResponse));
      }).toThrow(KintoneRestAPIError);
    });
    it("should raise an Error if error.response.data is a string", () => {
      const errorResponse: ErrorResponse = {
        data: "unexpected error",
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
      };
      expect(() => {
        errorResponseHandler(new HttpClientErrorImpl("", errorResponse));
      }).toThrow(`${errorResponse.status}: ${errorResponse.statusText}`);
    });
    it("should raise an error if error.response is undefined", () => {
      expect(() => {
        errorResponseHandler(new HttpClientErrorImpl("unknown error"));
      }).toThrow("unknown error");
    });
    it("should raise an error with appropriate message if the error is 'mac verify failure'", () => {
      expect(() => {
        errorResponseHandler(new HttpClientErrorImpl("mac verify failure"));
      }).toThrow("invalid clientCertAuth setting");
    });
  });
});
