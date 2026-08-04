import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { AppClient } from "../../AppClient";
import {
  APP_ID,
  expectRequest,
  makeHttpClients,
  wireParams,
} from "../fixtures/AppClientHttpFixture";

describe("Actions (HTTP level)", () => {
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

  describe("getAppActions", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getAppActions(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/app/actions.json",
          query: wireParams(params),
        });
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getAppActions({
          ...params,
          preview: true,
        });
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/preview/app/actions.json",
          query: wireParams(params),
        });
      });
    });
  });

  describe("updateAppActions", () => {
    const params = {
      app: APP_ID,
      actions: {
        Action_A: {
          name: "Action_A",
          index: "0",
          destApp: {
            code: "INVOICE",
          },
          mappings: [
            {
              srcType: "FIELD" as const,
              srcField: "CompanyName",
              destField: "CompanyName",
            },
            {
              srcType: "FIELD" as const,
              srcField: "DivisionName",
              destField: "DivisionName",
            },
            {
              srcType: "RECORD_URL" as const,
              destField: "URL",
            },
          ],
          entities: [
            {
              type: "USER" as const,
              code: "Administrator",
            },
          ],
          filterCond: 'Status = "Active"',
        },
      },
    };
    beforeEach(async () => {
      await appClient.updateAppActions(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/preview/app/actions.json",
        body: params,
      });
    });
  });
});
