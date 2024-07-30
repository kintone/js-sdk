import type { MockClient } from "../../../http/MockClient";
import { BulkRequestClient } from "../../BulkRequestClient";
import { RecordClient } from "../../RecordClient";
import {
  APP_ID,
  fieldCode,
  makeClients,
  record,
  RECORD_ID,
} from "../fixtures/RecordClientFixture";

describe("RecordTest", () => {
  let mockClient: MockClient;
  let recordClient: RecordClient;

  beforeEach(() => {
    const clients = makeClients();
    recordClient = clients.recordClient;
    mockClient = clients.mockClient;
  });

  describe("getRecord", () => {
    const params = { app: APP_ID, id: RECORD_ID };
    beforeEach(async () => {
      await recordClient.getRecord(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/record.json");
    });
    it("should send a get request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass app and id to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("addRecord", () => {
    const params = { app: APP_ID, record };
    beforeEach(async () => {
      await recordClient.addRecord(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/record.json");
    });
    it("should send a post request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass app and record object to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
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
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/record.json");
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app, id, record, and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
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
      let getRecordsMockFn: jest.Mock;
      let updateRecordMockFn: jest.Mock;
      let addRecordMockFn: jest.Mock;
      beforeEach(async () => {
        getRecordsMockFn = jest.fn().mockResolvedValue({
          records: [
            {
              $id: {
                type: "__ID__",
                value: "10",
              },
            },
          ],
        });
        updateRecordMockFn = jest.fn().mockResolvedValue({
          revision: "2",
        });
        addRecordMockFn = jest.fn();
        const bulkRequestClient = new BulkRequestClient(mockClient);
        recordClient = new RecordClient(mockClient, bulkRequestClient);
        recordClient.getRecords = getRecordsMockFn;
        recordClient.updateRecord = updateRecordMockFn;
        recordClient.addRecord = addRecordMockFn;
      });

      it("should call getRecords with a query built with udpateKey", async () => {
        await recordClient.upsertRecord(params);
        expect(getRecordsMockFn.mock.calls.length).toBe(1);
        expect(getRecordsMockFn.mock.calls[0][0]).toEqual({
          app: params.app,
          query: `${params.updateKey.field} = "${params.updateKey.value}"`,
        });
      });
      it("should call updateRecord with the params", async () => {
        await recordClient.upsertRecord(params);
        expect(updateRecordMockFn.mock.calls.length).toBe(1);
        expect(updateRecordMockFn.mock.calls[0][0]).toEqual(params);
      });
      it("should not call addRecord", async () => {
        await recordClient.upsertRecord(params);
        expect(addRecordMockFn.mock.calls.length).toBe(0);
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
      let getRecordsMockFn: jest.Mock;
      let updateRecordMockFn: jest.Mock;
      let addRecordMockFn: jest.Mock;
      beforeEach(() => {
        getRecordsMockFn = jest.fn().mockResolvedValue({
          records: [],
        });
        updateRecordMockFn = jest.fn();
        addRecordMockFn = jest.fn().mockResolvedValue({
          id: "10",
          revision: "1",
        });
        const bulkRequestClient = new BulkRequestClient(mockClient);
        recordClient = new RecordClient(mockClient, bulkRequestClient);
        recordClient.getRecords = getRecordsMockFn;
        recordClient.updateRecord = updateRecordMockFn;
        recordClient.addRecord = addRecordMockFn;
      });

      it("should call getRecords with a query built with udpateKey", async () => {
        await recordClient.upsertRecord(params);
        expect(getRecordsMockFn.mock.calls.length).toBe(1);
        expect(getRecordsMockFn.mock.calls[0][0]).toEqual({
          app: params.app,
          query: `${params.updateKey.field} = "${params.updateKey.value}"`,
        });
      });
      it("should call addRecord with the params", async () => {
        await recordClient.upsertRecord(params);
        expect(addRecordMockFn.mock.calls.length).toBe(1);
        expect(addRecordMockFn.mock.calls[0][0]).toEqual({
          app: params.app,
          record: {
            ...params.record,
            [params.updateKey.field]: { value: params.updateKey.value },
          },
        });
      });
      it("should not call updateRecord", async () => {
        await recordClient.upsertRecord(params);
        expect(updateRecordMockFn.mock.calls.length).toBe(0);
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
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/records.json");
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app, fields, query and totalCount to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
    describe("with offset", () => {
      let consoleWarnMock: jest.SpyInstance;
      beforeEach(() => {
        consoleWarnMock = jest.spyOn(console, "warn");
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
          mockClient.mockResponse(new Error("failed"));
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
      mockClient.mockResponse(mockResponse);
      response = await recordClient.addRecords(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/records.json");
    });
    it("should send a post request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass app and records to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
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
      records: [{ id: RECORD_ID, record, revision: 5 }],
    };
    beforeEach(async () => {
      await recordClient.updateRecords(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/records.json");
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app, id, record, and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
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
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/records.json");
    });
    it("should send a delete request", () => {
      expect(mockClient.getLogs()[0].method).toBe("delete");
    });
    it("should pass app, ids, and revisions to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});
