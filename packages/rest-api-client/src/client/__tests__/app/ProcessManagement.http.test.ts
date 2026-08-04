import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { AppClient } from "../../AppClient";
import {
  APP_ID,
  expectRequest,
  makeHttpClients,
  REVISION,
  wireParams,
} from "../fixtures/AppClientHttpFixture";

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
  {
    name: "action1to2",
    from: "status1",
    to: "status2",
    type: "PRIMARY" as const,
  },
  {
    name: "action2to3",
    from: "status2",
    to: "status3",
    filterCond: 'field = "foo"',
    type: "SECONDARY" as const,
    executableUser: {
      entities: [{ entity: { type: "USER" as const, code: "user1" } }],
    },
  },
];

describe("ProcessManagement (HTTP level)", () => {
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

  describe("getProcessManagement", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getProcessManagement(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/app/status.json",
          query: wireParams(params),
        });
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getProcessManagement({ ...params, preview: true });
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/preview/app/status.json",
          query: wireParams(params),
        });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/preview/app/status.json",
        body: params,
      });
    });
  });
});
