import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { AppClient } from "../../AppClient";
import {
  APP_ID,
  expectRequest,
  makeHttpClients,
  REVISION,
  wireParams,
} from "../fixtures/AppClientHttpFixture";

describe("AppCustomize (HTTP level)", () => {
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

  describe("getAppCustomize", () => {
    const params = { app: APP_ID };
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getAppCustomize(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/app/customize.json",
          query: wireParams(params),
        });
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getAppCustomize({ ...params, preview: true });
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/preview/app/customize.json",
          query: wireParams(params),
        });
      });
    });
  });

  describe("updateAppCustomize", () => {
    const resource = {
      js: [
        {
          type: "URL" as const,
          url: "https://www.example.com/example-mobile.js",
        },
      ],
      css: [
        {
          type: "FILE" as const,
          file: {
            fileKey: "ddfc8e89-7aa3-4350-b9ab-3a75c9cf46b3",
          },
        },
      ],
    };
    const params = {
      app: APP_ID,
      scope: "ALL" as const,
      desktop: resource,
      mobile: resource,
      revision: REVISION,
    };
    describe("customize resources are specified", () => {
      beforeEach(async () => {
        await appClient.updateAppCustomize(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "put",
          path: "/k/v1/preview/app/customize.json",
          body: params,
        });
      });
    });
  });
});
