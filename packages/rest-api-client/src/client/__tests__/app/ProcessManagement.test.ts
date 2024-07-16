import type { MockClient } from "../../../http/MockClient";
import type { AppClient } from "../../AppClient";
import { APP_ID, makeClients, REVISION } from "../fixtures/AppClientFixture";

const states = {
  status1: {
    name: "status1",
    index: 0,
    assignee: {
      type: "ONE" as const,
      entities: [
        { entity: { type: "FIELD_ENTITY" as const, code: "creator" } },
      ],
    },
  },
  status2: {
    name: "status2",
    index: 1,
    assignee: {
      type: "ANY" as const,
      entities: [{ entity: { type: "CREATOR" as const } }],
    },
  },
  status3: {
    name: "status3",
    index: 2,
    assignee: {
      type: "ALL" as const,
      entities: [
        { entity: { type: "USER" as const, code: "user1" } },
        { entity: { type: "USER" as const, code: "user2" } },
      ],
    },
  },
};

const actions = [
  { name: "action1to2", from: "status1", to: "status2" },
  {
    name: "action2to3",
    from: "status2",
    to: "status3",
    filterCond: 'field = "foo"',
  },
];

describe("ProcessManagement", () => {
  let mockClient: MockClient;
  let appClient: AppClient;

  beforeEach(() => {
    const clients = makeClients();
    appClient = clients.appClient;
    mockClient = clients.mockClient;
  });

  describe("getProcessManagement", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getProcessManagement(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/app/status.json");
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
        await appClient.getProcessManagement({ ...params, preview: true });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/status.json",
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

  describe("updateProcessManagement", () => {
    const params = {
      app: APP_ID,
      revision: REVISION,
      enable: true,
      states,
      actions,
    };
    beforeEach(async () => {
      await appClient.updateProcessManagement(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/status.json",
      );
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app, states, actions and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});
