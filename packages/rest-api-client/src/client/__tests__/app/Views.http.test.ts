import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { AppClient } from "../../AppClient";
import {
  APP_ID,
  expectRequest,
  makeHttpClients,
  REVISION,
  wireParams,
} from "../fixtures/AppClientHttpFixture";

const views = {
  view1: {
    type: "LIST" as const,
    index: 0,
    name: "view1",
    fields: ["field"],
    filterCond: 'field = "foo"',
    sort: "sortField desc",
  },
  view2: {
    type: "CALENDAR" as const,
    index: 1,
    name: "view2",
    date: "dateField",
    title: "titleField",
    filterCond: 'field = "bar"',
    sort: "sortField asc",
  },
  view3: {
    type: "CUSTOM" as const,
    index: 2,
    name: "view3",
    html: "<div>Hello!</div>",
    pager: true,
    device: "DESKTOP" as const,
  },
};

describe("Views Test (HTTP level)", () => {
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

  describe("getViews", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getViews(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/app/views.json",
          query: wireParams(params),
        });
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getViews({ ...params, preview: true });
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/preview/app/views.json",
          query: wireParams(params),
        });
      });
    });
  });

  describe("updateViews", () => {
    const params = { app: APP_ID, views, revision: REVISION };
    beforeEach(async () => {
      await appClient.updateViews(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/preview/app/views.json",
        body: params,
      });
    });
  });
});
