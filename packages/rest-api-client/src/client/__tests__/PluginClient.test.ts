import type { MockClient } from "../../http/MockClient";
import { buildMockClient } from "../../http/MockClient";
import { KintoneRequestConfigBuilder } from "../../KintoneRequestConfigBuilder";
import { PluginClient } from "../PluginClient";

describe("PluginClient", () => {
  let mockClient: MockClient;
  let pluginClient: PluginClient;

  beforeEach(() => {
    const requestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl: "https://example.cybozu.com",
      auth: { type: "apiToken", apiToken: "foo" },
    });
    mockClient = buildMockClient(requestConfigBuilder);
    pluginClient = new PluginClient(mockClient);
  });

  describe("getPlugins", () => {
    const params = {
      offset: 1,
      limit: 2,
    };
    beforeEach(async () => {
      await pluginClient.getPlugins(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/plugins.json");
    });
    it("should send a GET request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass the param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});
