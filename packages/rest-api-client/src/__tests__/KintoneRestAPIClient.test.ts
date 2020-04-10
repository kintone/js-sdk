import {
  KintoneRestAPIClient,
  errorResponseHandler,
} from "../KintoneRestAPIClient";
import { Base64 } from "js-base64";
import { KintoneRestAPIError } from "../KintoneRestAPIError";
import { ErrorResponse, HttpError } from "../http/HttpClientInterface";

describe("KintoneRestAPIClient", () => {
  describe("constructor", () => {
    let originalKintone: any;
    let originalLocation: any;
    beforeEach(() => {
      originalKintone = global.kintone;
      originalLocation = Object.getOwnPropertyDescriptor(global, "location");
      Object.defineProperty(global, "location", {
        writable: true,
      });
      global.kintone = {
        getRequestToken: () => "dummy request token",
      };
    });
    afterEach(() => {
      global.kintone = originalKintone;
      // Enable to update the location object to mock
      Object.defineProperty(global, "location", originalLocation);
    });
    describe("Header", () => {
      const baseUrl = "https://example.com";
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
        expect(() => new KintoneRestAPIClient()).toThrow(
          "in Node environment, baseUrl is required"
        );
      });
    });
  });
  describe("errorResponseHandler", () => {
    it("should raise a KintoneRestAPIError", () => {
      const errorResponse: ErrorResponse = {
        data: {},
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
      };
      expect(() => {
        errorResponseHandler({ response: errorResponse });
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
        errorResponseHandler({ response: errorResponse });
      }).toThrow(`${errorResponse.status}: ${errorResponse.statusText}`);
    });
    it("should raise an error if error.response is undefined", () => {
      expect(() => {
        errorResponseHandler(new HttpError("unknown error"));
      }).toThrow("unknown error");
    });
    it("should raise an error with appropriate message if the error is 'mac verify failure'", () => {
      expect(() => {
        errorResponseHandler(new HttpError("mac verify failure"));
      }).toThrow("invalid clientCertAuth setting");
    });
  });
});
