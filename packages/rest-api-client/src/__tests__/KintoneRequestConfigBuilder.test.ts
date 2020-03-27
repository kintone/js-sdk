import { KintoneRequestConfigBuilder } from "../KintoneRequestConfigBuilder";
import FormData from "form-data";

describe("KintoneRequestConfigBuilder", () => {
  const baseUrl = "https://example.kintone.com";
  const headers = {
    "X-Cybozu-API-Token": "foo",
  };
  const params = {
    __REQUEST_TOKEN__: "foo-bar",
  };
  let kintoneRequestConfigBuilder: KintoneRequestConfigBuilder;
  beforeEach(() => {
    kintoneRequestConfigBuilder = new KintoneRequestConfigBuilder(
      baseUrl,
      headers,
      params
    );
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
