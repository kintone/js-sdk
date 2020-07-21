import { KintoneRestAPIClient } from "../KintoneRestAPIClient";
import { injectPlatformDeps } from "../platform";
import * as browserDeps from "../platform/browser";
import { KintoneRestAPIError } from "../error/KintoneRestAPIError";
import { KintoneAbortSearchError } from "../error/KintoneAbortSearchError";
import {
  ErrorResponse,
  Response,
  HttpClientError,
} from "../http/HttpClientInterface";
import { KintoneResponseHandler } from "../KintoneResponseHandler";

describe("KintoneResponseHandler", () => {
  describe("handle", () => {
    class HttpClientErrorImpl<T> extends Error implements HttpClientError<T> {
      public response?: T;

      constructor(message: string, response?: T) {
        super(message);
        this.response = response;
      }
    }
    it("should throw an error if KintoneAbortSearchError is enabled and x-cybozu-warning is'Filter aborted because of too many search results'", () => {
      const responseHandler = new KintoneResponseHandler({
        enableAbortSearchError: true,
      });
      const response: Response = {
        data: { status: "success" },
        headers: {
          "x-cybozu-warning":
            "Filter aborted because of too many search results",
        },
      };
      return expect(
        responseHandler.handle(Promise.resolve(response))
      ).rejects.toThrow(KintoneAbortSearchError);
    });
    it("should not throw an error if enableAbortSearchError is disabled and x-cybozu-warning is'Filter aborted because of too many search results'", () => {
      const responseHandler = new KintoneResponseHandler({
        enableAbortSearchError: false,
      });
      const response: Response = {
        data: { status: "success" },
        headers: {
          "x-cybozu-warning":
            "Filter aborted because of too many search results",
        },
      };
      return expect(
        responseHandler.handle(Promise.resolve(response))
      ).resolves.toStrictEqual({ status: "success" });
    });
    it("should raise a KintoneRestAPIError", () => {
      const responseHandler = new KintoneResponseHandler({
        enableAbortSearchError: false,
      });
      const errorResponse: ErrorResponse = {
        data: {},
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
      };
      expect(
        responseHandler.handle(
          Promise.reject(new HttpClientErrorImpl("", errorResponse))
        )
      ).rejects.toThrow(KintoneRestAPIError);
    });
    it("should raise an Error if error.response.data is a string", () => {
      const responseHandler = new KintoneResponseHandler({
        enableAbortSearchError: false,
      });
      const errorResponse: ErrorResponse = {
        data: "unexpected error",
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
      };
      expect(
        responseHandler.handle(
          Promise.reject(new HttpClientErrorImpl("", errorResponse))
        )
      ).rejects.toThrow(`${errorResponse.status}: ${errorResponse.statusText}`);
    });
    it("should raise an error if error.response is undefined", () => {
      const responseHandler = new KintoneResponseHandler({
        enableAbortSearchError: false,
      });
      expect(
        responseHandler.handle(
          Promise.reject(new HttpClientErrorImpl("unknown error"))
        )
      ).rejects.toThrow("unknown error");
    });
    it("should raise an error with appropriate message if the error is 'mac verify failure'", () => {
      const responseHandler = new KintoneResponseHandler({
        enableAbortSearchError: false,
      });
      expect(
        responseHandler.handle(
          Promise.reject(new HttpClientErrorImpl("mac verify failure"))
        )
      ).rejects.toThrow("invalid clientCertAuth setting");
    });
  });
});
