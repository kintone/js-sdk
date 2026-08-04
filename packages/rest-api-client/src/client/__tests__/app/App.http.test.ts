import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { AppClient } from "../../AppClient";
import {
  APP_ID,
  expectRequest,
  makeHttpClients,
  wireParams,
} from "../fixtures/AppClientHttpFixture";

describe("App Test (HTTP level)", () => {
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

  describe("getApp", () => {
    const params = {
      id: APP_ID,
    };
    beforeEach(async () => {
      httpServer.mockResponse({ appId: String(APP_ID), name: "app" });
      await appClient.getApp(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "get",
        path: "/k/v1/app.json",
        query: wireParams(params),
      });
    });
    it("should return the parsed response body from the server", async () => {
      httpServer.reset();
      httpServer.mockResponse({ appId: String(APP_ID), name: "app" });
      await expect(appClient.getApp(params)).resolves.toStrictEqual({
        appId: String(APP_ID),
        name: "app",
      });
    });
  });

  describe("getApps", () => {
    const params = {
      ids: [APP_ID],
      codes: ["APP"],
      name: "app",
      spaceIds: [1, 2],
      limit: 100,
      offset: 30,
    };
    beforeEach(async () => {
      await appClient.getApps(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "get",
        path: "/k/v1/apps.json",
        query: wireParams(params),
      });
    });
  });

  describe("addApp", () => {
    describe("without space", () => {
      const params = {
        name: "app",
      };
      beforeEach(async () => {
        httpServer.mockResponse({ app: "1", revision: "1" });
        await appClient.addApp(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "post",
          path: "/k/v1/preview/app.json",
          body: params,
        });
      });
    });
    describe("with space", () => {
      const params = {
        name: "app",
        space: 10,
      };
      const defaultThread = 20;
      beforeEach(async () => {
        httpServer.mockResponse({ defaultThread });
        httpServer.mockResponse({ app: "1", revision: "1" });
        await appClient.addApp(params);
      });
      it("should fetch the default thread of the space", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/space.json",
          query: wireParams({ id: params.space }),
        });
      });
      it("should add new app into the default thread", () => {
        expectRequest(httpServer, 1, {
          method: "post",
          path: "/k/v1/preview/app.json",
          body: { ...params, thread: defaultThread },
        });
      });
    });
  });

  describe("move", () => {
    describe("with space parameter", () => {
      const params = { app: APP_ID, space: 1 } as const;
      beforeEach(async () => {
        await appClient.move(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "post",
          path: "/k/v1/app/move.json",
          body: params,
        });
      });
    });

    describe("without space parameter", () => {
      const params = { app: APP_ID } as const;
      beforeEach(async () => {
        await appClient.move(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "post",
          path: "/k/v1/app/move.json",
          body: params,
        });
      });
    });
  });

  describe("getStatistics", () => {
    describe("with empty params", () => {
      beforeEach(async () => {
        await appClient.getStatistics({});
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/apps/statistics.json",
          query: {},
        });
      });
    });

    describe("with offset and limit", () => {
      const params = {
        offset: 10,
        limit: 50,
      };
      beforeEach(async () => {
        await appClient.getStatistics(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/apps/statistics.json",
          query: wireParams(params),
        });
      });
    });
  });
});
