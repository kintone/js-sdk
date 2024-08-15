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
      auth: {
        type: "password",
        username: "hoge",
        password: "foo",
      },
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

  describe("getRequiredPlugins", () => {
    const params = {
      offset: 1,
      limit: 2,
    };
    beforeEach(async () => {
      await pluginClient.getRequiredPlugins(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/plugins/required.json");
    });
    it("should send a GET request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass the param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("getApps", () => {
    const params = {
      id: "pluginId",
      offset: 1,
      limit: 2,
    };
    beforeEach(async () => {
      await pluginClient.getApps(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/plugin/apps.json");
    });
    it("should send a GET request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass the param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("updatePlugin", () => {
    const params = {
      id: "pluginId",
      fileKey: "fileKey",
    };
    beforeEach(async () => {
      await pluginClient.updatePlugin(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/plugin.json");
    });
    it("should send a PUT request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass the param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("installPlugin", () => {
    const params = {
      fileKey: "fileKey",
    };
    beforeEach(async () => {
      await pluginClient.installPlugin(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/plugin.json");
    });
    it("should send a POST request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass the param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});
