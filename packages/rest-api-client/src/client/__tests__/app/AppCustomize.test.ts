import type { MockClient } from "../../../http/MockClient";
import type { AppClient } from "../../AppClient";
import { APP_ID, makeClients, REVISION } from "../fixtures/AppClientFixture";

describe("AppCustomize", () => {
  let mockClient: MockClient;
  let appClient: AppClient;

  beforeEach(() => {
    const clients = makeClients();
    appClient = clients.appClient;
    mockClient = clients.mockClient;
  });

  describe("getAppCustomize", () => {
    const params = { app: APP_ID };
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getAppCustomize(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/app/customize.json");
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getAppCustomize({ ...params, preview: true });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/customize.json",
        );
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and preview as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
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
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/customize.json",
        );
      });
      it("should send a put request", () => {
        expect(mockClient.getLogs()[0].method).toBe("put");
      });
      it("should pass app, scope, desktop, mobile and revision as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
  });
});
