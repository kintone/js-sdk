import { KintoneRequestConfigBuilder } from "../KintoneRequestConfigBuilder";
import FormData from "form-data";
import { injectPlatformDeps } from "../platform";
import * as browserDeps from "../platform/browser";
import os from "os";

const packageJson = require("../../package.json");
const nodeVersion = process.version;
const osName = os.type();
const packageName = packageJson.name;
const packageVersion = packageJson.version;

const expectedUa = `Node.js/${nodeVersion}(${osName}) ${packageName}@${packageVersion}`;

describe("KintoneRequestConfigBuilder in Node.js environment", () => {
  const baseUrl = "https://example.kintone.com";
  const apiToken = "apiToken";
  let kintoneRequestConfigBuilder: KintoneRequestConfigBuilder;
  beforeEach(() => {
    kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      auth: {
        type: "apiToken",
        apiToken,
      },
    });
  });
  it("should build get method requestConfig", () => {
    const requestConfig = kintoneRequestConfigBuilder.build(
      "get",
      "/k/v1/record.json",
      { key: "value" }
    );
    expect(requestConfig).toStrictEqual({
      method: "get",
      proxy: undefined,
      url: `${baseUrl}/k/v1/record.json?key=value`,
      headers: {
        "User-Agent": expectedUa,
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
        "User-Agent": expectedUa,
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
    expect(requestConfig).toStrictEqual({
      method: "get",
      proxy: undefined,
      url: `${baseUrl}/k/v1/record.json?key=value`,
      headers: {
        "User-Agent": expectedUa,
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
        "User-Agent": expectedUa,
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
    expect(config).toStrictEqual({
      method: "post",
      proxy: undefined,
      url: `${baseUrl}/k/v1/record.json`,
      headers: {
        "User-Agent": expectedUa,
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
        "User-Agent": expectedUa,
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
        "User-Agent": expectedUa,
        "X-Cybozu-API-Token": apiToken,
      },
    });
  });
});

describe("KintoneRequestConfigBuilder in Browser environment", () => {
  const baseUrl = "https://example.kintone.com";
  const requestToken = "requestToken";
  let kintoneRequestConfigBuilder: KintoneRequestConfigBuilder;
  beforeEach(() => {
    injectPlatformDeps({
      ...browserDeps,
      getRequestToken: () => requestToken,
    });

    kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      auth: {
        type: "session",
      },
    });
  });
  it("should build get method requestConfig", () => {
    const requestConfig = kintoneRequestConfigBuilder.build(
      "get",
      "/k/v1/record.json",
      { key: "value" }
    );
    expect(requestConfig).toStrictEqual({
      method: "get",
      proxy: undefined,
      url: `${baseUrl}/k/v1/record.json?key=value`,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
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
        "X-Requested-With": "XMLHttpRequest",
        "X-HTTP-Method-Override": "GET",
      },
      data: { key: value, __REQUEST_TOKEN__: requestToken },
    });
  });
  it("should build get method requestConfig for data", () => {
    const requestConfig = kintoneRequestConfigBuilder.build(
      "get",
      "/k/v1/record.json",
      { key: "value" },
      { responseType: "arraybuffer" }
    );
    expect(requestConfig).toStrictEqual({
      method: "get",
      proxy: undefined,
      url: `${baseUrl}/k/v1/record.json?key=value`,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
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
        "X-Requested-With": "XMLHttpRequest",
      },
      data: {
        key: "value",
        __REQUEST_TOKEN__: requestToken,
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
    expect(config).toStrictEqual({
      method: "post",
      proxy: undefined,
      url: `${baseUrl}/k/v1/record.json`,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
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
        "X-Requested-With": "XMLHttpRequest",
      },
      data: {
        key: "value",
        __REQUEST_TOKEN__: requestToken,
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
      url: `${baseUrl}/k/v1/record.json?__REQUEST_TOKEN__=${requestToken}&key=value`,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
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
      "User-Agent": expectedUa,
    };
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
    expect(requestConfig).toStrictEqual({
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
    ).toStrictEqual({
      "User-Agent": expectedUa,
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
    ).toStrictEqual({
      "User-Agent": expectedUa,
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
    ).toStrictEqual({
      "User-Agent": expectedUa,
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
    ).toStrictEqual({
      "User-Agent": expectedUa,
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
    ).toStrictEqual({
      "User-Agent": expectedUa,
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
    ).toStrictEqual({
      Authorization: `Bearer ${oAuthToken}`,
      "User-Agent": expectedUa,
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
    ).toStrictEqual({
      Authorization: `Basic ${Base64.encode("user:password")}`,
      "User-Agent": expectedUa,
      "X-Requested-With": "XMLHttpRequest",
    });
  });

  it("should not include User-Agent for browser enviroment", () => {
    injectPlatformDeps(browserDeps);
    const kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl,
      auth: {
        type: "session",
      },
    });
    const headers = kintoneRequestConfigBuilder.build(
      "get",
      "/k/v1/record.json",
      {}
    ).headers;
    expect(headers["User-Agent"]).toBeUndefined();
  });
});
