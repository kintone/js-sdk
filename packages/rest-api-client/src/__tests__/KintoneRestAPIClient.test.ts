import {
  KintoneRestAPIClient,
  KintoneRequestHandler
} from "../KintoneRestAPIClient";
import { Base64 } from "js-base64";

describe("KintoneRestAPIClient", () => {
  let originalKintone: any;
  let originalLocation: any;
  beforeEach(() => {
    originalKintone = global.kintone;
    originalLocation = Object.getOwnPropertyDescriptor(global, "location");
    Object.defineProperty(global, "location", {
      writable: true
    });
    global.kintone = {
      getRequestToken: () => "dummy request token"
    };
  });
  afterEach(() => {
    global.kintone = originalKintone;
    // Enable to update the location object to mock
    Object.defineProperty(global, "location", originalLocation);
  });
  describe("constructor", () => {
    describe("Header", () => {
      const baseUrl = "https://example.com";
      it("ApiToken auth", () => {
        const API_TOKEN = "ApiToken";
        const auth = {
          apiToken: API_TOKEN
        };
        const client = new KintoneRestAPIClient({ baseUrl, auth });
        expect(client.getHeaders()).toEqual({
          "X-Cybozu-API-Token": API_TOKEN
        });
      });
      it("ApiToken auth using multiple tokens as comma-separated string", () => {
        const API_TOKEN1 = "ApiToken1";
        const API_TOKEN2 = "ApiToken2";
        const auth = {
          apiToken: `${API_TOKEN1},${API_TOKEN2}`
        };
        const client = new KintoneRestAPIClient({ baseUrl, auth });
        expect(client.getHeaders()).toEqual({
          "X-Cybozu-API-Token": `${API_TOKEN1},${API_TOKEN2}`
        });
      });
      it("ApiToken auth using multiple tokens as array", () => {
        const API_TOKEN1 = "ApiToken1";
        const API_TOKEN2 = "ApiToken2";
        const auth = {
          apiToken: [API_TOKEN1, API_TOKEN2]
        };
        const client = new KintoneRestAPIClient({ baseUrl, auth });
        expect(client.getHeaders()).toEqual({
          "X-Cybozu-API-Token": `${API_TOKEN1},${API_TOKEN2}`
        });
      });
      it("Password  auth", () => {
        const USERNAME = "user";
        const PASSWORD = "password";
        const auth = {
          username: USERNAME,
          password: PASSWORD
        };
        const client = new KintoneRestAPIClient({ baseUrl, auth });
        expect(client.getHeaders()).toEqual({
          "X-Cybozu-Authorization": Base64.encode(`${USERNAME}:${PASSWORD}`)
        });
      });
      it("Session auth", () => {
        const auth = {};
        const client = new KintoneRestAPIClient({ baseUrl, auth });
        expect(client.getHeaders()).toEqual({
          "X-Requested-With": "XMLHttpRequest"
        });
      });
      it("Basic auth", () => {
        const basicAuth = { username: "user", password: "password" };
        const client = new KintoneRestAPIClient({ baseUrl, basicAuth });
        expect(client.getHeaders()).toEqual({
          Authorization: `Basic ${Base64.encode("user:password")}`,
          "X-Requested-With": "XMLHttpRequest"
        });
      });
      it("should use Session auth if auth param is not specified", () => {
        const client = new KintoneRestAPIClient({ baseUrl });
        expect(client.getHeaders()).toEqual({
          "X-Requested-With": "XMLHttpRequest"
        });
      });

      it("should use location.origin in browser environment if baseUrl param is not specified", () => {
        global.location = {
          origin: "https://example.com"
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
});

describe("KintoneRequestHandler", () => {
  const baseUrl = "https://example.kintone.com";
  const headers = {
    "X-Cybozu-API-Token": "foo"
  };
  const params = {
    __REQUEST_TOKEN__: "foo-bar"
  };
  let kintoneRequestHandler: KintoneRequestHandler;
  beforeEach(() => {
    kintoneRequestHandler = new KintoneRequestHandler(baseUrl, headers, params);
  });
  it("should build get method requestConfig", () => {
    const requestConfig = kintoneRequestHandler.build(
      "get",
      "/k/v1/record.json",
      { key: "value" }
    );
    expect(requestConfig).toEqual({
      method: "get",
      url: `${baseUrl}/k/v1/record.json?key=value`,
      headers
    });
  });
  it.todo(
    "should build post method requestConfig if the request URL is over the threshold"
  );
  it("should build get method requestConfig for data", () => {
    const requestConfig = kintoneRequestHandler.build(
      "get",
      "/k/v1/record.json",
      { key: "value" },
      { formData: true }
    );
    expect(requestConfig).toEqual({
      method: "get",
      url: `${baseUrl}/k/v1/record.json?key=value`,
      headers,
      responseType: "arraybuffer"
    });
  });
  it("should build post method requestConfig", () => {
    const requestConfig = kintoneRequestHandler.build(
      "post",
      "/k/v1/record.json",
      { key: "value" }
    );
    expect(requestConfig).toEqual({
      method: "post",
      url: `${baseUrl}/k/v1/record.json`,
      data: {
        ...params,
        key: "value"
      },
      headers
    });
  });
  it.todo("should build post method requestConfig for data");
  it("should build put method requestConfig", () => {
    const requestConfig = kintoneRequestHandler.build(
      "put",
      "/k/v1/record.json",
      { key: "value" }
    );
    expect(requestConfig).toEqual({
      method: "put",
      url: `${baseUrl}/k/v1/record.json`,
      data: {
        ...params,
        key: "value"
      },
      headers
    });
  });
  it("should build delete method requestConfig", () => {
    const requestConfig = kintoneRequestHandler.build(
      "delete",
      "/k/v1/record.json",
      { key: "value" }
    );
    expect(requestConfig).toEqual({
      method: "delete",
      url: `${baseUrl}/k/v1/record.json?key=value`,
      headers
    });
  });
});
