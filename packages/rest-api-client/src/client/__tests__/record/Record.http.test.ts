import type { MockInstance } from "vitest";
import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { RecordClient } from "../../RecordClient";
import {
  APP_ID,
  expectRequest,
  fieldCode,
  makeHttpClients,
  record,
  RECORD_ID,
  wireParams,
} from "../fixtures/RecordClientHttpFixture";

describe("RecordTest (HTTP level)", () => {
  let httpServer: HttpTestServer;
  let recordClient: RecordClient;

  beforeEach(() => {
    const clients = makeHttpClients();
    recordClient = clients.recordClient;
    httpServer = clients.httpServer;
  });

  afterEach(() => {
    httpServer.close();
  });

  describe("getRecord", () => {
    const params = { app: APP_ID, id: RECORD_ID };
    beforeEach(async () => {
      await recordClient.getRecord(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "get",
        path: "/k/v1/record.json",
        query: wireParams(params),
      });
    });
  });

  describe("addRecord", () => {
    const params = { app: APP_ID, record };
    beforeEach(async () => {
      await recordClient.addRecord(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/record.json",
        body: params,
      });
    });
  });

  describe("updateRecord", () => {
    const params = {
      app: APP_ID,
      id: RECORD_ID,
      record,
      revision: 5,
    };
    beforeEach(async () => {
      await recordClient.updateRecord(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/record.json",
        body: params,
      });
    });
  });

  describe("upsertRecord", () => {
    describe("update", () => {
      const params = {
        app: APP_ID,
        updateKey: {
          field: "Code",
          value: "foo",
        },
        record,
        revision: 5,
      };
      beforeEach(() => {
        httpServer.mockResponse({
          records: [
            {
              $id: {
                type: "__ID__",
                value: "10",
              },
            },
          ],
        });
        httpServer.mockResponse({
          revision: "2",
        });
      });

      it("should call getRecords with a query built with updateKey", async () => {
        await recordClient.upsertRecord(params);
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/records.json",
          query: wireParams({
            app: params.app,
            query: `${params.updateKey.field} = "${params.updateKey.value}"`,
          }),
        });
      });
      it("should call updateRecord with the params", async () => {
        await recordClient.upsertRecord(params);
        expectRequest(httpServer, 1, {
          method: "put",
          path: "/k/v1/record.json",
          body: params,
        });
      });
      it("should not call addRecord", async () => {
        await recordClient.upsertRecord(params);
        expect(httpServer.getLogs()).toHaveLength(2);
      });
      it("should return id and revision properties", async () => {
        const result = await recordClient.upsertRecord(params);
        expect(result).toEqual({
          id: "10",
          revision: "2",
        });
      });
    });
    describe("insert", () => {
      const params = {
        app: APP_ID,
        updateKey: {
          field: "Customer",
          value: "foo",
        },
        record,
        revision: 5,
      };
      beforeEach(() => {
        httpServer.mockResponse({
          records: [],
        });
        httpServer.mockResponse({
          id: "10",
          revision: "1",
        });
      });

      it("should call getRecords with a query built with updateKey", async () => {
        await recordClient.upsertRecord(params);
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/records.json",
          query: wireParams({
            app: params.app,
            query: `${params.updateKey.field} = "${params.updateKey.value}"`,
          }),
        });
      });
      it("should call addRecord with the params", async () => {
        await recordClient.upsertRecord(params);
        expectRequest(httpServer, 1, {
          method: "post",
          path: "/k/v1/record.json",
          body: {
            app: params.app,
            record: {
              ...params.record,
              [params.updateKey.field]: { value: params.updateKey.value },
            },
          },
        });
      });
      it("should not call updateRecord", async () => {
        await recordClient.upsertRecord(params);
        expect(httpServer.getLogs()).toHaveLength(2);
      });
      it("should return id and revision properties", async () => {
        const result = await recordClient.upsertRecord(params);
        expect(result).toEqual({
          id: "10",
          revision: "1",
        });
      });
    });
  });

  describe("getRecords", () => {
    describe("without offset", () => {
      const params = {
        app: APP_ID,
        fields: [fieldCode],
        query: `${fieldCode} = "foo"`,
        totalCount: true,
      };
      beforeEach(async () => {
        await recordClient.getRecords(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/records.json",
          query: wireParams(params),
        });
      });
    });
    describe("with offset", () => {
      let consoleWarnMock: MockInstance;
      beforeEach(() => {
        consoleWarnMock = vi.spyOn(console, "warn");
        consoleWarnMock.mockImplementation((x) => x);
      });
      describe("offset <= 10000", () => {
        const params = {
          app: APP_ID,
          fields: [fieldCode],
          query: `${fieldCode} = "foo" offset 10000`,
          totalCount: true,
        };
        it("doesn't output any message to the console", async () => {
          await recordClient.getRecords(params);
          expect(consoleWarnMock.mock.calls.length).toBe(0);
        });
      });
      describe("offset > 10000", () => {
        const params = {
          app: APP_ID,
          fields: [fieldCode],
          query: `${fieldCode} = "foo" offset 10001`,
          totalCount: true,
        };
        it("outputs a message to the console only once when the request succeeds", async () => {
          await recordClient.getRecords(params);
          await recordClient.getRecords(params);
          expect(consoleWarnMock.mock.calls.length).toBe(1);
        });
        it("doesn't output any message to the console when the request fails", async () => {
          expect.assertions(1);
          httpServer.mockResponse({}, 500);
          try {
            await recordClient.getRecords(params);
          } catch {
            expect(consoleWarnMock.mock.calls.length).toBe(0);
          }
        });
      });
      afterEach(() => {
        consoleWarnMock.mockReset();
        consoleWarnMock.mockRestore();
      });
    });
  });

  describe("addRecords", () => {
    const params = { app: APP_ID, records: [record] };
    const mockResponse = {
      ids: ["10", "20", "30"],
      revisions: ["1", "2", "3"],
    };
    let response: any;
    beforeEach(async () => {
      httpServer.mockResponse(mockResponse);
      response = await recordClient.addRecords(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/records.json",
        body: params,
      });
    });
    it("should return a response having ids, revisions, and records", () => {
      expect(response).toEqual({
        ...mockResponse,
        records: [
          { id: "10", revision: "1" },
          { id: "20", revision: "2" },
          { id: "30", revision: "3" },
        ],
      });
    });
  });

  describe("updateRecords", () => {
    const params = {
      app: APP_ID,
      upsert: false,
      records: [{ id: RECORD_ID, record, revision: 5 }],
    };
    beforeEach(async () => {
      await recordClient.updateRecords(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/records.json",
        body: params,
      });
    });
  });

  describe("deleteRecords", () => {
    const ids = [10, 20, 30];
    const revisions = [1, 2, 3];
    const params = {
      app: APP_ID,
      ids,
      revisions,
    };
    beforeEach(async () => {
      await recordClient.deleteRecords(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "delete",
        path: "/k/v1/records.json",
        query: wireParams(params),
      });
    });
  });
});
