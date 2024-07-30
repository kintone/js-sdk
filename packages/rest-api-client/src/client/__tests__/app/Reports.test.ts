import type { MockClient } from "../../../http/MockClient";
import type { AppClient } from "../../AppClient";
import { APP_ID, makeClients } from "../fixtures/AppClientFixture";

describe("Reports", () => {
  let mockClient: MockClient;
  let appClient: AppClient;

  beforeEach(() => {
    const clients = makeClients();
    appClient = clients.appClient;
    mockClient = clients.mockClient;
  });

  describe("getReports", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getReports(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/app/reports.json");
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
        await appClient.getReports({
          ...params,
          preview: true,
        });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/reports.json",
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

  describe("updateReports", () => {
    const params = {
      app: 1,
      reports: {
        "Graph 1": {
          chartType: "BAR" as const,
          chartMode: "NORMAL" as const,
          name: "Graph 1",
          index: 0,
          groups: [
            {
              code: "Radio_button",
            },
          ],
          aggregations: [
            {
              type: "COUNT" as const,
            },
          ],
          filterCond: "",
          sorts: [
            {
              by: "TOTAL" as const,
              order: "DESC" as const,
            },
          ],
          periodicReport: {
            active: true,
            period: {
              every: "QUARTER" as const,
              pattern: "JAN_APR_JUL_OCT" as const,
              dayOfMonth: "END_OF_MONTH" as const,
              time: "23:30",
            },
          },
        },
      },
    };
    beforeEach(async () => {
      await appClient.updateReports(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/reports.json",
      );
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app and rights as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});
