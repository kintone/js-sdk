import type { MockClient } from "../../../http/MockClient";
import type { AppClient } from "../../AppClient";
import { APP_ID, makeClients } from "../fixtures/AppClientFixture";

describe("App Test", () => {
  let mockClient: MockClient;
  let appClient: AppClient;

  beforeEach(() => {
    const clients = makeClients();
    appClient = clients.appClient;
    mockClient = clients.mockClient;
  });

  describe("getApp", () => {
    const params = {
      id: APP_ID,
    };
    beforeEach(async () => {
      await appClient.getApp(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/app.json");
    });
    it("should send a get request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass id as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
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
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/apps.json");
    });
    it("should send a get request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass ids, codes, name, spaceIds, limit, and offset as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("addApp", () => {
    describe("without space", () => {
      const params = {
        name: "app",
      };
      beforeEach(async () => {
        await appClient.addApp(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/preview/app.json");
      });
      it("should send a post request", () => {
        expect(mockClient.getLogs()[0].method).toBe("post");
      });
      it("should pass name, space, and thread as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
    describe("with space", () => {
      const params = {
        name: "app",
        space: 10,
      };
      const defaultThread = 20;
      beforeEach(async () => {
        mockClient.mockResponse({ defaultThread });
        await appClient.addApp(params);
      });
      it("should fetch the default thread of the space", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/space.json");
        expect(mockClient.getLogs()[0].method).toBe("get");
        expect(mockClient.getLogs()[0].params).toEqual({ id: params.space });
      });
      it("should add new app into the default thread", () => {
        expect(mockClient.getLogs()[1].path).toBe("/k/v1/preview/app.json");
        expect(mockClient.getLogs()[1].method).toBe("post");
        expect(mockClient.getLogs()[1].params).toEqual({
          ...params,
          thread: defaultThread,
        });
      });
    });
  });

  describe("move", () => {
    const params = { app: APP_ID, space: 1 } as const;
    beforeEach(async () => {
      await appClient.move(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/app/move.json");
    });
    it("should send a post request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass app and space as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});
