import type { MockClient } from "../../../http/MockClient";
import type { AppClient } from "../../AppClient";
import { APP_ID, makeClients, REVISION } from "../fixtures/AppClientFixture";

describe("AppSettings", () => {
  let mockClient: MockClient;
  let appClient: AppClient;

  beforeEach(() => {
    const clients = makeClients();
    appClient = clients.appClient;
    mockClient = clients.mockClient;
  });

  describe("getAppSettings", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getAppSettings(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/app/settings.json");
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and lang to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getAppSettings({ ...params, preview: true });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/settings.json",
        );
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and lang to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
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
        selectionMode: "AUTO" as const,
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
    };
    beforeEach(async () => {
      await appClient.updateAppSettings(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/settings.json",
      );
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app, name, description, icon, theme and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});
