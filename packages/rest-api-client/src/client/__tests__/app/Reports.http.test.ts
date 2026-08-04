import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { AppClient } from "../../AppClient";
import {
  APP_ID,
  expectRequest,
  makeHttpClients,
  wireParams,
} from "../fixtures/AppClientHttpFixture";

describe("Reports (HTTP level)", () => {
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

  describe("getReports", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getReports(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/app/reports.json",
          query: wireParams(params),
        });
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getReports({
          ...params,
          preview: true,
        });
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/preview/app/reports.json",
          query: wireParams(params),
        });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/preview/app/reports.json",
        body: params,
      });
    });
  });
});
