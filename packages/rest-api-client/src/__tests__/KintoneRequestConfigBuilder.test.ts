import { KintoneRequestConfigBuilder } from "../KintoneRequestConfigBuilder";
import FormData from "form-data";

import { injectPlatformDeps } from "../platform";
import * as nodeDeps from "../platform/node";

describe("KintoneRequestConfigBuilder", () => {
  const baseUrl = "https://example.kintone.com";
  const apiToken = "apiToken";
  const requestToken = "foo-bar";
  const params = {
    __REQUEST_TOKEN__: requestToken,
  };
  let kintoneRequestConfigBuilder: KintoneRequestConfigBuilder;
  beforeEach(() => {
    kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      auth: {
        type: "apiToken",
        apiToken,
      },
      ...params,
    });
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
      headers: {
        "X-Cybozu-API-Token": apiToken,
      },
    });
  });
  it("should build post method requestConfig if the request URL is over the threshold", () => {
    const value = "a".repeat(4096);
    const requestConfig = kintoneRequestConfigBuilder.build(
      "get",
      "/k/v1/record.json",
      { key: value }
    );
    expect(requestConfig).toStrictEqual({
      method: "post",
      proxy: undefined,
      url: `${baseUrl}/k/v1/record.json`,
      headers: {
        "X-Cybozu-API-Token": apiToken,
        "X-HTTP-Method-Override": "GET",
      },
      data: { key: value },
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
      headers: {
        "X-Cybozu-API-Token": apiToken,
      },
      responseType: "arraybuffer",
    });
  });
  it("should build post method requestConfig", () => {
    const requestConfig = kintoneRequestConfigBuilder.build(
      "post",
      "/k/v1/record.json",
      { key: "value" }
    );
    expect(requestConfig).toStrictEqual({
      method: "post",
      proxy: undefined,
      url: `${baseUrl}/k/v1/record.json`,
      headers: {
        "X-Cybozu-API-Token": apiToken,
      },
      data: {
        key: "value",
      },
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
        "X-Cybozu-API-Token": apiToken,
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
    expect(requestConfig).toStrictEqual({
      method: "put",
      proxy: undefined,
      url: `${baseUrl}/k/v1/record.json`,
      headers: {
        "X-Cybozu-API-Token": apiToken,
      },
      data: {
        key: "value",
      },
    });
  });
  it("should build delete method requestConfig", () => {
    const requestConfig = kintoneRequestConfigBuilder.build(
      "delete",
      "/k/v1/record.json",
      { key: "value" }
    );
    expect(requestConfig).toStrictEqual({
      method: "delete",
      proxy: undefined,
      url: `${baseUrl}/k/v1/record.json?key=value`,
      headers: {
        "X-Cybozu-API-Token": apiToken,
      },
    });
  });
});

describe("options", () => {
  it("should build `requestConfig` having `proxy` property", () => {
    const baseUrl = "https://example.kintone.com";
    const apiToken = "apiToken";
    const headers = {
      "X-Cybozu-API-Token": apiToken,
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
      auth: {
        type: "apiToken",
        apiToken,
      },
      proxy,
    });

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
    const apiToken = "apiToken";
    const clientCertAuth = {
      pfx: Buffer.alloc(0),
      password: "password",
    };

    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      clientCertAuth,
      auth: {
        type: "apiToken",
        apiToken,
      },
    });

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
    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      auth: {
        type: "password",
        username: USERNAME,
        password: PASSWORD,
      },
    });
    expect(
      kintoneRequestConfigBuilder.build("get", "/k/v1/record.json", {}).headers
    ).toEqual({
      "X-Cybozu-Authorization": Base64.encode(`${USERNAME}:${PASSWORD}`),
    });
  });

  it("ApiToken auth", () => {
    const API_TOKEN = "ApiToken";
    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      auth: {
        type: "apiToken",
        apiToken: API_TOKEN,
      },
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
    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      auth: {
        type: "apiToken",
        apiToken: `${API_TOKEN1},${API_TOKEN2}`,
      },
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
    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      auth: {
        type: "apiToken",
        apiToken: [API_TOKEN1, API_TOKEN2],
      },
    });
    expect(
      kintoneRequestConfigBuilder.build("get", "/k/v1/record.json", {}).headers
    ).toEqual({
      "X-Cybozu-API-Token": `${API_TOKEN1},${API_TOKEN2}`,
    });
  });

  it("Session auth", () => {
    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      auth: {
        type: "session",
      },
    });
    expect(
      kintoneRequestConfigBuilder.build("get", "/k/v1/record.json", {}).headers
    ).toEqual({
      "X-Requested-With": "XMLHttpRequest",
    });
  });

  it("OAuth token auth", () => {
    const oAuthToken = "oauth-token";
    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      auth: {
        type: "oAuthToken",
        oAuthToken,
      },
    });
    expect(
      kintoneRequestConfigBuilder.build("get", "/k/v1/record.json", {}).headers
    ).toEqual({
      Authorization: `Bearer ${oAuthToken}`,
    });
  });

  it("Basic auth", () => {
    const basicAuth = { username: "user", password: "password" };
    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      basicAuth,
      auth: {
        type: "session",
      },
    });
    expect(
      kintoneRequestConfigBuilder.build("get", "/k/v1/record.json", {}).headers
    ).toEqual({
      Authorization: `Basic ${Base64.encode("user:password")}`,
      "X-Requested-With": "XMLHttpRequest",
    });
  });
});
