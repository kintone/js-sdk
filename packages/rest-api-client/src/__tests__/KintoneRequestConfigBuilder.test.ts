import { KintoneRequestConfigBuilder } from "../KintoneRequestConfigBuilder";
import FormData from "form-data";

import { injectPlatformDeps } from "../platform";
import * as nodeDeps from "../platform/node";

describe("KintoneRequestConfigBuilder", () => {
  const baseUrl = "https://example.kintone.com";
  const headers = {
    "X-Cybozu-API-Token": "foo",
  };
  const requestToken = "foo-bar";
  const params = {
    __REQUEST_TOKEN__: requestToken,
  };
  let kintoneRequestConfigBuilder: KintoneRequestConfigBuilder;
  beforeEach(() => {
    kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      ...params,
    });
    kintoneRequestConfigBuilder.setHeaders(headers);
    kintoneRequestConfigBuilder.setRequestToken(requestToken);
  });
  it("should build get method requestConfig", () => {
    const requestConfig = kintoneRequestConfigBuilder.build(
      "get",
      "/k/v1/record.json",
      { key: "value" }
    );
    expect(requestConfig).toEqual({
      method: "get",
      url: `${baseUrl}/k/v1/record.json?key=value`,
      headers,
    });
  });
  it("should build post method requestConfig if the request URL is over the threshold", () => {
    const value = "a".repeat(4096);
    const requestConfig = kintoneRequestConfigBuilder.build(
      "get",
      "/k/v1/record.json",
      { key: value }
    );
    expect(requestConfig).toEqual({
      method: "post",
      url: `${baseUrl}/k/v1/record.json`,
      headers: { ...headers, "X-HTTP-Method-Override": "GET" },
      data: { ...params, key: value },
    });
  });
  it("should build get method requestConfig for data", () => {
    const requestConfig = kintoneRequestConfigBuilder.build(
      "get",
      "/k/v1/record.json",
      { key: "value" },
      { responseType: "arraybuffer" }
    );
    expect(requestConfig).toEqual({
      method: "get",
      url: `${baseUrl}/k/v1/record.json?key=value`,
      headers,
      responseType: "arraybuffer",
    });
  });
  it("should build post method requestConfig", () => {
    const requestConfig = kintoneRequestConfigBuilder.build(
      "post",
      "/k/v1/record.json",
      { key: "value" }
    );
    expect(requestConfig).toEqual({
      method: "post",
      url: `${baseUrl}/k/v1/record.json`,
      data: {
        ...params,
        key: "value",
      },
      headers,
    });
  });
  it("should build post method requestConfig for data", () => {
    const formData = new FormData();
    formData.append("key", "value");
    const requestConfig = kintoneRequestConfigBuilder.build(
      "post",
      "/k/v1/record.json",
      formData
    );
    const { data, ...config } = requestConfig;
    expect(config).toEqual({
      method: "post",
      url: `${baseUrl}/k/v1/record.json`,
      headers: {
        ...headers,
        ...formData.getHeaders(),
      },
    });
    expect(data).toBeInstanceOf(FormData);
  });
  it("should build put method requestConfig", () => {
    const requestConfig = kintoneRequestConfigBuilder.build(
      "put",
      "/k/v1/record.json",
      { key: "value" }
    );
    expect(requestConfig).toEqual({
      method: "put",
      url: `${baseUrl}/k/v1/record.json`,
      data: {
        ...params,
        key: "value",
      },
      headers,
    });
  });
  it("should build delete method requestConfig", () => {
    const requestConfig = kintoneRequestConfigBuilder.build(
      "delete",
      "/k/v1/record.json",
      { key: "value" }
    );
    expect(requestConfig).toEqual({
      method: "delete",
      url: `${baseUrl}/k/v1/record.json?__REQUEST_TOKEN__=foo-bar&key=value`,
      headers,
    });
  });
});

describe("options", () => {
  it("should build `requestConfig` having `proxy` property", () => {
    const baseUrl = "https://example.kintone.com";
    const headers = {
      "X-Cybozu-API-Token": "foo",
    };
    const requestToken = "foo-bar";
    const proxy = {
      host: "localhost",
      port: 8000,
      auth: {
        username: "admin",
        password: "password",
      },
    };

    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      proxy,
    });
    kintoneRequestConfigBuilder.setHeaders(headers);
    kintoneRequestConfigBuilder.setRequestToken(requestToken);

    const requestConfig = kintoneRequestConfigBuilder.build(
      "get",
      "/k/v1/record.json",
      { key: "value" }
    );
    expect(requestConfig).toEqual({
      method: "get",
      url: `${baseUrl}/k/v1/record.json?key=value`,
      headers,
      proxy,
    });
  });

  it("should build `requestConfig` having `httpsAgent` property", () => {
    const baseUrl = "https://example.kintone.com";
    const clientCertAuth = {
      pfx: Buffer.alloc(0),
      password: "password",
    };

    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      clientCertAuth,
    });
    kintoneRequestConfigBuilder.setRequestToken("foo-bar");

    const requestConfig = kintoneRequestConfigBuilder.build(
      "get",
      "/k/v1/record.json",
      { key: "value" }
    );
    expect(requestConfig).toHaveProperty("httpsAgent");
  });
});

describe("Headers", () => {
  const baseUrl = "https://example.com";

  it("Password auth", () => {
    const USERNAME = "user";
    const PASSWORD = "password";
    const auth = {
      username: USERNAME,
      password: PASSWORD,
    };
    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      auth,
    });
    expect(
      kintoneRequestConfigBuilder.build("get", "/k/v1/record.json", {}).headers
    ).toEqual({
      "X-Cybozu-Authorization": Base64.encode(`${USERNAME}:${PASSWORD}`),
    });
  });

  it("ApiToken auth", () => {
    const API_TOKEN = "ApiToken";
    const auth = {
      apiToken: API_TOKEN,
    };
    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      auth,
    });
    expect(
      kintoneRequestConfigBuilder.build("get", "/k/v1/record.json", {}).headers
    ).toEqual({
      "X-Cybozu-API-Token": API_TOKEN,
    });
  });

  it("ApiToken auth using multiple tokens as comma-separated string", () => {
    const API_TOKEN1 = "ApiToken1";
    const API_TOKEN2 = "ApiToken2";
    const auth = {
      apiToken: `${API_TOKEN1},${API_TOKEN2}`,
    };
    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      auth,
    });
    expect(
      kintoneRequestConfigBuilder.build("get", "/k/v1/record.json", {}).headers
    ).toEqual({
      "X-Cybozu-API-Token": `${API_TOKEN1},${API_TOKEN2}`,
    });
  });

  it("ApiToken auth using multiple tokens as array", () => {
    const API_TOKEN1 = "ApiToken1";
    const API_TOKEN2 = "ApiToken2";
    const auth = {
      apiToken: [API_TOKEN1, API_TOKEN2],
    };
    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      auth,
    });
    expect(
      kintoneRequestConfigBuilder.build("get", "/k/v1/record.json", {}).headers
    ).toEqual({
      "X-Cybozu-API-Token": `${API_TOKEN1},${API_TOKEN2}`,
    });
  });

  it("Session auth", () => {
    const auth = {};
    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      auth,
    });
    expect(
      kintoneRequestConfigBuilder.build("get", "/k/v1/record.json", {}).headers
    ).toEqual({
      "X-Requested-With": "XMLHttpRequest",
    });
  });

  it("should use Session auth if auth param is not specified", () => {
    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
    });
    expect(
      kintoneRequestConfigBuilder.build("get", "/k/v1/record.json", {}).headers
    ).toEqual({
      "X-Requested-With": "XMLHttpRequest",
    });
  });

  it.skip("should raise an error if trying to use session auth in Node.js environment", () => {
    injectPlatformDeps(nodeDeps);
    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
    });
    expect(
      kintoneRequestConfigBuilder.build("get", "/k/v1/record.json", {})
    ).toThrow(
      "session authentication is not supported in Node.js environment."
    );
  });

  it("OAuth token auth", () => {
    const auth = { oAuthToken: "oauth-token" };
    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      auth,
    });
    expect(
      kintoneRequestConfigBuilder.build("get", "/k/v1/record.json", {}).headers
    ).toEqual({
      Authorization: `Bearer ${auth.oAuthToken}`,
    });
  });

  it("Basic auth", () => {
    const basicAuth = { username: "user", password: "password" };
    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      basicAuth,
    });
    expect(
      kintoneRequestConfigBuilder.build("get", "/k/v1/record.json", {}).headers
    ).toEqual({
      Authorization: `Basic ${Base64.encode("user:password")}`,
      "X-Requested-With": "XMLHttpRequest",
    });
  });
});
