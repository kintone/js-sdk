import type { MockClient } from "../../../http/MockClient";
import type { AppClient } from "../../AppClient";
import { APP_ID, makeClients, REVISION } from "../fixtures/AppClientFixture";

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

describe("Views Test", () => {
  let mockClient: MockClient;
  let appClient: AppClient;

  beforeEach(() => {
    const clients = makeClients();
    appClient = clients.appClient;
    mockClient = clients.mockClient;
  });
  describe("getViews", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getViews(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/app/views.json");
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
        await appClient.getViews({ ...params, preview: true });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/views.json",
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

  describe("updateViews", () => {
    const params = { app: APP_ID, views, revision: REVISION };
    beforeEach(async () => {
      await appClient.updateViews(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/preview/app/views.json");
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app, views and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});
