import type { MockClient } from "../../../http/MockClient";
import type { AppClient } from "../../AppClient";
import { APP_ID, makeClients } from "../fixtures/AppClientFixture";

describe("Actions", () => {
  let mockClient: MockClient;
  let appClient: AppClient;

  beforeEach(() => {
    const clients = makeClients();
    appClient = clients.appClient;
    mockClient = clients.mockClient;
  });

  describe("getAppActions", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getAppActions(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/app/actions.json");
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and lang as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getAppActions({
          ...params,
          preview: true,
        });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/actions.json",
        );
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and lang as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
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
        },
      },
    };
    beforeEach(async () => {
      await appClient.updateAppActions(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/actions.json",
      );
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app and actions as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});
