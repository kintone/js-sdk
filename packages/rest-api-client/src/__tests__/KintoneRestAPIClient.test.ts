import {
  KintoneRestAPIClient,
  errorResponseHandler,
} from "../KintoneRestAPIClient";
import { Base64 } from "js-base64";
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
      it("ApiToken auth", () => {
        const API_TOKEN = "ApiToken";
        const auth = {
          apiToken: API_TOKEN,
        };
        const client = new KintoneRestAPIClient({ baseUrl, auth });
        expect(client.getHeaders()).toEqual({
          "X-Cybozu-API-Token": API_TOKEN,
        });
      });
      it("ApiToken auth using multiple tokens as comma-separated string", () => {
        const API_TOKEN1 = "ApiToken1";
        const API_TOKEN2 = "ApiToken2";
        const auth = {
          apiToken: `${API_TOKEN1},${API_TOKEN2}`,
        };
        const client = new KintoneRestAPIClient({ baseUrl, auth });
        expect(client.getHeaders()).toEqual({
          "X-Cybozu-API-Token": `${API_TOKEN1},${API_TOKEN2}`,
        });
      });
      it("ApiToken auth using multiple tokens as array", () => {
        const API_TOKEN1 = "ApiToken1";
        const API_TOKEN2 = "ApiToken2";
        const auth = {
          apiToken: [API_TOKEN1, API_TOKEN2],
        };
        const client = new KintoneRestAPIClient({ baseUrl, auth });
        expect(client.getHeaders()).toEqual({
          "X-Cybozu-API-Token": `${API_TOKEN1},${API_TOKEN2}`,
        });
      });
      it("Password  auth", () => {
        const USERNAME = "user";
        const PASSWORD = "password";
        const auth = {
          username: USERNAME,
          password: PASSWORD,
        };
        const client = new KintoneRestAPIClient({ baseUrl, auth });
        expect(client.getHeaders()).toEqual({
          "X-Cybozu-Authorization": Base64.encode(`${USERNAME}:${PASSWORD}`),
        });
      });
      it("Session auth", () => {
        const auth = {};
        const client = new KintoneRestAPIClient({ baseUrl, auth });
        expect(client.getHeaders()).toEqual({
          "X-Requested-With": "XMLHttpRequest",
        });
      });
      it("Basic auth", () => {
        const basicAuth = { username: "user", password: "password" };
        const client = new KintoneRestAPIClient({ baseUrl, basicAuth });
        expect(client.getHeaders()).toEqual({
          Authorization: `Basic ${Base64.encode("user:password")}`,
          "X-Requested-With": "XMLHttpRequest",
        });
      });
      it("should use Session auth if auth param is not specified", () => {
        const client = new KintoneRestAPIClient({ baseUrl });
        expect(client.getHeaders()).toEqual({
          "X-Requested-With": "XMLHttpRequest",
        });
      });

      it("should use location.origin in browser environment if baseUrl param is not specified", () => {
        global.location = {
          origin: "https://example.com",
        };
        const client = new KintoneRestAPIClient();
        expect(client.getBaseUrl()).toBe("https://example.com");
      });

      it("should raise an error in Node environment if baseUrl param is not specified", () => {
        global.location = undefined;
        const USERNAME = "user";
        const PASSWORD = "password";
        const auth = {
          username: USERNAME,
          password: PASSWORD,
        };
        expect(() => new KintoneRestAPIClient({ auth })).toThrow(
          "in Node environment, baseUrl is required"
        );
      });
      it("should raise an error in Node enviroment if use session auth", () => {
        injectPlatformDeps(nodeDeps);
        expect(() => new KintoneRestAPIClient({ baseUrl })).toThrow(
          "session authorization doesn't allow on a Node.js environment."
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
