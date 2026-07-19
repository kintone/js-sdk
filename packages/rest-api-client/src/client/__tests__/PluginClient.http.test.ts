import type { HttpTestServer } from "./fixtures/HttpTestServer";
import type { PluginClient } from "../PluginClient";
import {
  expectRequest,
  makeHttpClients,
  wireParams,
} from "./fixtures/PluginClientHttpFixture";

describe("PluginClient (HTTP level)", () => {
  let httpServer: HttpTestServer;
  let pluginClient: PluginClient;

  beforeEach(() => {
    const clients = makeHttpClients();
    pluginClient = clients.pluginClient;
    httpServer = clients.httpServer;
  });

  afterEach(() => {
    httpServer.close();
  });

  describe("getPlugins", () => {
    const params = {
      offset: 1,
      limit: 2,
    };
    beforeEach(async () => {
      await pluginClient.getPlugins(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "get",
        path: "/k/v1/plugins.json",
        query: wireParams(params),
      });
    });

    describe("with ids parameter", () => {
      const paramsWithIds = {
        offset: 0,
        limit: 10,
        ids: ["plugin1", "plugin2", "plugin3"],
      };
      beforeEach(async () => {
        await pluginClient.getPlugins(paramsWithIds);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 1, {
          method: "get",
          path: "/k/v1/plugins.json",
          query: wireParams(paramsWithIds),
        });
      });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "get",
        path: "/k/v1/plugins/required.json",
        query: wireParams(params),
      });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "get",
        path: "/k/v1/plugin/apps.json",
        query: wireParams(params),
      });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/plugin.json",
        body: params,
      });
    });
  });

  describe("installPlugin", () => {
    const params = {
      fileKey: "fileKey",
    };
    beforeEach(async () => {
      await pluginClient.installPlugin(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/plugin.json",
        body: params,
      });
    });
  });

  describe("uninstallPlugin", () => {
    const params = {
      id: "pluginId",
    };
    beforeEach(async () => {
      await pluginClient.uninstallPlugin(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "delete",
        path: "/k/v1/plugin.json",
        query: wireParams(params),
      });
    });
  });
});
