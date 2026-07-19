import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { AppClient } from "../../AppClient";
import {
  APP_ID,
  expectRequest,
  makeHttpClients,
  wireParams,
} from "../fixtures/AppClientHttpFixture";

describe("AppClient: plugins (HTTP level)", () => {
  let httpServer: HttpTestServer;
  let appClient: AppClient;

  beforeEach(() => {
    const clients = makeHttpClients();
    appClient = clients.appClient;
    httpServer = clients.httpServer;
  });

  afterEach(() => {
    httpServer.close();
  });

  describe("getPlugins", () => {
    const params = { app: APP_ID, lang: "en" } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getPlugins(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/app/plugins.json",
          query: wireParams(params),
        });
      });
    });

    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getPlugins({
          ...params,
          preview: true,
        });
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/preview/app/plugins.json",
          query: wireParams(params),
        });
      });
    });
  });

  describe("addPlugins", () => {
    const params = { app: APP_ID, ids: ["abc", "xyz"], revision: 1 };
    beforeEach(async () => {
      await appClient.addPlugins(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/preview/app/plugins.json",
        body: params,
      });
    });
  });
});
