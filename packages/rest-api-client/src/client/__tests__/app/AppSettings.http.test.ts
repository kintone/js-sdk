import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { AppClient } from "../../AppClient";
import {
  APP_ID,
  expectRequest,
  makeHttpClients,
  REVISION,
  wireParams,
} from "../fixtures/AppClientHttpFixture";

describe("AppSettings (HTTP level)", () => {
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

  describe("getAppSettings", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getAppSettings(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/app/settings.json",
          query: wireParams(params),
        });
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getAppSettings({ ...params, preview: true });
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/preview/app/settings.json",
          query: wireParams(params),
        });
      });
    });
  });

  describe("updateAppSettings", () => {
    const params = {
      app: APP_ID,
      revision: REVISION,
      name: "test app",
      description: "<div>Description</div>",
      icon: {
        type: "FILE" as const,
        file: {
          fileKey: "file key",
        },
      },
      theme: "WHITE" as const,
      titleField: {
        selectionMode: "MANUAL" as const,
        code: "titleFieldCode",
      },
      enableThumbnails: true,
      enableBulkDeletion: true,
      enableComments: true,
      enableDuplicateRecord: true,
      numberPrecision: {
        digits: 30,
        decimalPlaces: "10",
        roundingMode: "HALF_EVEN" as const,
      },
      firstMonthOfFiscalYear: 12,
      enableInlineRecordEditing: true,
    };
    beforeEach(async () => {
      await appClient.updateAppSettings(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/preview/app/settings.json",
        body: params,
      });
    });
  });
});
