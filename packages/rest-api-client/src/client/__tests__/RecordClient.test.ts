import { RecordClient } from "../RecordClient";
import { BulkRequestClient } from "../BulkRequestClient";
import { MockClient, buildMockClient } from "../../http/MockClient";
import { KintoneAllRecordsError } from "../../error/KintoneAllRecordsError";
import { KintoneRestAPIError } from "../../error/KintoneRestAPIError";
import { Record } from "../types";
import { KintoneRequestConfigBuilder } from "../../KintoneRequestConfigBuilder";

describe("RecordClient", () => {
  let mockClient: MockClient;
  let recordClient: RecordClient;
  const APP_ID = 1;
  const RECORD_ID = 2;
  const fieldCode = "Customer";
  const record = {
    [fieldCode]: {
      value: "ABC Corporation",
    },
  };

  beforeEach(() => {
    const requestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl: "https://example.cybozu.com",
      auth: { type: "apiToken", apiToken: "foo" },
    });
    mockClient = buildMockClient(requestConfigBuilder);
    const bulkRequestClient = new BulkRequestClient(mockClient);
    recordClient = new RecordClient(mockClient, bulkRequestClient);
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

  describe("createCursor", () => {
    const params = {
      app: APP_ID,
      fields: [fieldCode],
      query: `${fieldCode} = "foo"`,
      size: 10,
    };
    beforeEach(async () => {
      await recordClient.createCursor(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/records/cursor.json");
    });
    it("should send a post request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass app, fields, query, and size to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("getRecordsByCursor", () => {
    const params = {
      id: "cursor id",
    };
    beforeEach(async () => {
      await recordClient.getRecordsByCursor(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/records/cursor.json");
    });
    it("should send a get request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass id to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("deleteCursor", () => {
    const params = {
      id: "cursor id",
    };
    beforeEach(async () => {
      await recordClient.deleteCursor(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/records/cursor.json");
    });
    it("should send a delete request", () => {
      expect(mockClient.getLogs()[0].method).toBe("delete");
    });
    it("should pass id to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("getAllRecordsWithId", () => {
    describe("success with condition", () => {
      it("should do nothing if `fields` is not specified", async () => {
        const params = {
          app: APP_ID,
          condition: `${fieldCode} = "foo"`,
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithId<Record>(params);
        expect(mockClient.getLogs()[0].params.fields).toBe(undefined);
      });

      it("should do nothing if `fields` is empty", async () => {
        const params = {
          app: APP_ID,
          fields: [],
          condition: `${fieldCode} = "foo"`,
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithId<Record>(params);
        expect(mockClient.getLogs()[0].params.fields).toEqual([]);
      });

      it("should append `$id` if `fields` is specified and doesn't contain `$id`", async () => {
        const params = {
          app: APP_ID,
          fields: [fieldCode],
          condition: `${fieldCode} = "foo"`,
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithId<Record>(params);
        expect(mockClient.getLogs()[0].params.fields.sort()).toEqual(
          [...params.fields, "$id"].sort()
        );
      });

      it("should do nothing if `fields` is specified and contains `$id`", async () => {
        const params = {
          app: APP_ID,
          fields: ["$id", fieldCode],
          condition: `${fieldCode} = "foo"`,
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithId<Record>(params);
        expect(mockClient.getLogs()[0].params.fields).toEqual(params.fields);
      });
    });

    describe("success with condition", () => {
      const params = {
        app: APP_ID,
        fields: ["$id"],
        condition: `${fieldCode} = "foo"`,
      };
      let result: Record[];

      beforeEach(async () => {
        const records = [];
        for (let i = 1; i <= 500; i++) {
          records.push({
            $id: {
              type: "__ID__",
              value: i.toString(),
            },
          });
        }
        mockClient.mockResponse({ records });
        mockClient.mockResponse({
          records: [{ $id: { type: "__ID__", value: "501" } }],
        });
        result = await recordClient.getAllRecordsWithId<Record>(params);
      });

      it("should return all records", () => {
        expect(mockClient.getLogs()[0]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: `(${
              params.condition || ""
            }) and $id > 0 order by $id asc limit 500`,
          },
        });
        expect(mockClient.getLogs()[1]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: `(${
              params.condition || ""
            }) and $id > 500 order by $id asc limit 500`,
          },
        });

        expect(result.length).toBe(501);
        expect(result[500]).toStrictEqual({
          $id: { type: "__ID__", value: "501" },
        });
      });
    });

    describe("success without condition", () => {
      const params = {
        app: APP_ID,
        fields: ["$id"],
      };
      let result: Record[];

      beforeEach(async () => {
        const records = [];
        for (let i = 1; i <= 500; i++) {
          records.push({
            $id: {
              type: "__ID__",
              value: i.toString(),
            },
          });
        }
        mockClient.mockResponse({ records });
        mockClient.mockResponse({
          records: [{ $id: { type: "__ID__", value: "501" } }],
        });
        result = await recordClient.getAllRecordsWithId<Record>(params);
      });

      it("should return all records", () => {
        expect(mockClient.getLogs()[0]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: "$id > 0 order by $id asc limit 500",
          },
        });
        expect(mockClient.getLogs()[1]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: "$id > 500 order by $id asc limit 500",
          },
        });

        expect(result.length).toBe(501);
        expect(result[500]).toStrictEqual({
          $id: { type: "__ID__", value: "501" },
        });
      });
    });
  });

  describe("getAllRecordsWithOffset", () => {
    describe("condition and orderBy parameters", () => {
      it("with condition and orderBy", async () => {
        const params = {
          app: APP_ID,
          condition: `${fieldCode} = "foo"`,
          orderBy: `${fieldCode} asc`,
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithOffset<Record>(params);
        expect(mockClient.getLogs()[0].params.query).toBe(
          `${fieldCode} = "foo" order by ${fieldCode} asc limit 500 offset 0`
        );
      });

      it("with condition, without orderBy", async () => {
        const params = {
          app: APP_ID,
          condition: `${fieldCode} = "foo"`,
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithOffset<Record>(params);
        expect(mockClient.getLogs()[0].params.query).toBe(
          `${fieldCode} = "foo" limit 500 offset 0`
        );
      });

      it("without condition, with orderBy", async () => {
        const params = {
          app: APP_ID,
          orderBy: `${fieldCode} asc`,
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithOffset<Record>(params);
        expect(mockClient.getLogs()[0].params.query).toBe(
          `order by ${fieldCode} asc limit 500 offset 0`
        );
      });

      it("neither condition nor orderBy", async () => {
        const params = {
          app: APP_ID,
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithOffset<Record>(params);
        expect(mockClient.getLogs()[0].params.query).toBe("limit 500 offset 0");
      });
    });

    describe("success", () => {
      const params = {
        app: APP_ID,
        fields: ["$id"],
        condition: `${fieldCode} = "foo"`,
      };
      let result: Record[];

      beforeEach(async () => {
        const records = [];
        for (let i = 1; i <= 500; i++) {
          records.push({
            $id: {
              type: "__ID__",
              value: i.toString(),
            },
          });
        }
        mockClient.mockResponse({ records });
        mockClient.mockResponse({
          records: [{ $id: { type: "__ID__", value: "501" } }],
        });
        result = await recordClient.getAllRecordsWithOffset<Record>(params);
      });

      it("should return all records", () => {
        expect(mockClient.getLogs()[0]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: `${params.condition || ""} limit 500 offset 0`,
          },
        });
        expect(mockClient.getLogs()[1]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: `${params.condition || ""} limit 500 offset 500`,
          },
        });

        expect(result.length).toBe(501);
        expect(result[500]).toStrictEqual({
          $id: { type: "__ID__", value: "501" },
        });
      });
    });
  });

  describe("getAllRecords", () => {
    describe("`orderBy` is specified", () => {
      const params = {
        app: APP_ID,
        condition: `${fieldCode} = "foo"`,
        orderBy: `${fieldCode} asc`,
      };
      let withCursorMockFn: jest.Mock;
      let withOffsetMockFn: jest.Mock;
      beforeEach(() => {
        withCursorMockFn = jest.fn();
        withOffsetMockFn = jest.fn();
        recordClient.getAllRecordsWithCursor = withCursorMockFn;
        recordClient.getAllRecordsWithOffset = withOffsetMockFn;
      });
      it("should call `getAllRecordsWithCursor` if `withCursor` is not specified", async () => {
        await recordClient.getAllRecords({ ...params });
        expect(withCursorMockFn.mock.calls.length).toBe(1);
        expect(withCursorMockFn.mock.calls[0][0]).toStrictEqual({
          app: params.app,
          query: `${params.condition} order by ${params.orderBy}`,
        });
      });
      it("should call `getAllRecordsWithCursor` if `withCursor` is true", async () => {
        await recordClient.getAllRecords({ ...params, withCursor: true });
        expect(withCursorMockFn.mock.calls.length).toBe(1);
        expect(withCursorMockFn.mock.calls[0][0]).toStrictEqual({
          app: params.app,
          query: `${params.condition} order by ${params.orderBy}`,
        });
      });
      it("should call `getAllRecordsWithOffset` if `withCursor` is false", async () => {
        await recordClient.getAllRecords({ ...params, withCursor: false });
        expect(withOffsetMockFn.mock.calls.length).toBe(1);
        expect(withOffsetMockFn.mock.calls[0][0]).toStrictEqual(params);
      });
    });

    describe("`orderBy` is an empty string", () => {
      const params = {
        app: APP_ID,
        condition: `${fieldCode} = "foo"`,
        orderBy: "",
      };
      const { orderBy, ...expected } = params;
      let mockFn: jest.Mock;
      beforeEach(() => {
        mockFn = jest.fn();
        recordClient.getAllRecordsWithId = mockFn;
      });
      it("should call `getAllRecordsWithId` if `withCursor` is not specified", async () => {
        await recordClient.getAllRecords(params);
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(expected);
      });
      it("should call `getAllRecordsWithId` if `withCursor` is true", async () => {
        await recordClient.getAllRecords({ ...params, withCursor: true });
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(expected);
      });
      it("should call `getAllRecordsWithId` if `withCursor` is false", async () => {
        await recordClient.getAllRecords({ ...params, withCursor: false });
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(expected);
      });
    });
    describe("`orderBy` is not specified", () => {
      const params = {
        app: APP_ID,
        condition: `${fieldCode} = "foo"`,
      };
      let mockFn: jest.Mock;
      beforeEach(() => {
        mockFn = jest.fn();
        recordClient.getAllRecordsWithId = mockFn;
      });
      it("should call `getAllRecordsWithId` if `withCursor` is not specified", async () => {
        await recordClient.getAllRecords(params);
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(params);
      });
      it("should call `getAllRecordsWithId` if `withCursor` is true", async () => {
        await recordClient.getAllRecords({ ...params, withCursor: true });
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(params);
      });
      it("should call `getAllRecordsWithId` if `withCursor` is false", async () => {
        await recordClient.getAllRecords({ ...params, withCursor: false });
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(params);
      });
    });
  });

  describe("getAllRecordsWithCursor", () => {
    const params = {
      app: APP_ID,
      fields: [fieldCode],
      query: `${fieldCode} = "foo"`,
    };
    const CURSOR_ID = "1";
    let result: Record[];

    describe("success", () => {
      beforeEach(async () => {
        // response from createCursor
        mockClient.mockResponse({ id: CURSOR_ID, totalCount: "4" });
        // response from getRecordsByCursor
        mockClient.mockResponse({
          records: [
            { $id: { type: "__ID__", value: "1" } },
            { $id: { type: "__ID__", value: "2" } },
          ],
          next: true,
        });
        mockClient.mockResponse({
          records: [
            { $id: { type: "__ID__", value: "3" } },
            { $id: { type: "__ID__", value: "4" } },
          ],
          next: false,
        });
        result = await recordClient.getAllRecordsWithCursor<Record>(params);
      });

      it("should create a cursor", () => {
        expect(mockClient.getLogs()[0]).toEqual({
          path: "/k/v1/records/cursor.json",
          method: "post",
          params,
        });
      });

      it("should return all records", () => {
        expect(mockClient.getLogs()[1]).toEqual({
          path: "/k/v1/records/cursor.json",
          method: "get",
          params: { id: CURSOR_ID },
        });
        expect(mockClient.getLogs()[2]).toEqual({
          path: "/k/v1/records/cursor.json",
          method: "get",
          params: { id: CURSOR_ID },
        });
        expect(result).toStrictEqual([
          { $id: { type: "__ID__", value: "1" } },
          { $id: { type: "__ID__", value: "2" } },
          { $id: { type: "__ID__", value: "3" } },
          { $id: { type: "__ID__", value: "4" } },
        ]);
      });

      it("should not call deleteCursor", () => {
        expect(mockClient.getLogs().length).toEqual(3);
      });
    });

    describe("failure", () => {
      beforeEach(() => {
        // response from createCursor
        mockClient.mockResponse({ id: CURSOR_ID, totalCount: "4" });
        // response from getRecordsByCursor
        mockClient.mockResponse({
          records: [{ id: 1 }, { id: 2 }],
          next: true,
        });
        mockClient.mockResponse(new Error("failed"));
      });

      it("should raise error", async () => {
        await expect(
          recordClient.getAllRecordsWithCursor<Record>(params)
        ).rejects.toThrow("failed");
        expect(mockClient.getLogs()[3]).toStrictEqual({
          path: "/k/v1/records/cursor.json",
          method: "delete",
          params: { id: CURSOR_ID },
        });
      });
    });
  });

  describe("addAllRecords", () => {
    const params = {
      app: APP_ID,
      records: Array.from({ length: 3000 }, (_, index) => index + 1).map(
        (value) => ({
          [fieldCode]: {
            value,
          },
        })
      ),
    };
    let response: any;
    describe("success", () => {
      const mockResponse = {
        results: Array.from({ length: 20 }, (_, index) => index + 1).map(
          (value) => ({
            ids: Array.from({ length: 100 }, (_, index) => index + 1),
            revisions: Array.from({ length: 100 }, () => 1),
          })
        ),
      };
      const mockResponse2 = {
        results: Array.from({ length: 10 }, (_, index) => index + 1).map(
          (value) => ({
            ids: Array.from({ length: 100 }, (_, index) => index + 1),
            revisions: Array.from({ length: 100 }, () => 1),
          })
        ),
      };
      beforeEach(async () => {
        // response from first call of bulkRequest.send
        mockClient.mockResponse(mockResponse);
        // response from second call of bulkRequest.send
        mockClient.mockResponse(mockResponse2);
        response = await recordClient.addAllRecords(params);
      });
      it("should call bulkRequest multiple times", () => {
        expect(mockClient.getLogs().length).toBe(2);
      });

      it("should return merged result of each bulkRequest's result", () => {
        const accumulateResponse = (
          acc: Array<{ id: number; revision: number }>,
          { ids, revisions }: { ids: number[]; revisions: number[] }
        ) =>
          acc.concat(
            ids.map((id, index) => ({
              id,
              revision: revisions[index],
            }))
          );

        const expected = [
          ...mockResponse.results.reduce(accumulateResponse, []),
          ...mockResponse2.results.reduce(accumulateResponse, []),
        ];
        expect(response.records).toStrictEqual(expected);
      });
    });

    describe("parameter error", () => {
      it("should raise an Error if `records` parameter is not an array", async () => {
        const invalidParams: any = {
          app: APP_ID,
          records: Array.from({ length: 3000 }, (_, index) => index + 1).map(
            (value) => {
              if (value === 1000) {
                return value;
              }
              return {
                [fieldCode]: {
                  value,
                },
              };
            }
          ),
        };
        await expect(recordClient.addAllRecords(invalidParams)).rejects.toThrow(
          "the `records` parameter must be an array of object."
        );
      });
    });
    describe("response error", () => {
      // success
      const mockResponse = {
        results: Array.from({ length: 20 }, (_, index) => index + 1).map(
          (value) => ({
            ids: Array.from({ length: 100 }, (_, index) => index + 1),
            revisions: Array.from({ length: 100 }, () => 1),
          })
        ),
      };
      // failed
      const errorResponse = {
        data: {
          results: [
            {},
            {},
            {
              id: "some id",
              code: "some code",
              message: "some error message",
              errors: {
                [`records[5].Customer`]: {
                  messages: ["key is missing"],
                },
              },
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
        },
        status: 500,
        statusText: "Internal Server Error",
        headers: {
          "X-Some-Header": "error",
        },
      };
      beforeEach(async () => {
        mockClient.mockResponse(mockResponse);
        mockClient.mockResponse(new KintoneRestAPIError(errorResponse));
      });
      it("should raise an KintoneAllRecordsError if an error occurs during bulkRequest", async () => {
        await expect(recordClient.addAllRecords(params)).rejects.toBeInstanceOf(
          KintoneAllRecordsError
        );
      });
    });
  });

  describe("updateAllRecords", () => {
    const params = {
      app: APP_ID,
      records: Array.from({ length: 3000 }, (_, index) => index + 1).map(
        (value) => ({
          id: value,
          record: {
            [fieldCode]: {
              value: `${fieldCode}-${value}`,
            },
          },
          revision: 1,
        })
      ),
    };
    let response: any;
    describe("success", () => {
      const mockResponse = {
        results: Array.from({ length: 20 }, (_, index) => index).map(
          (value) => ({
            records: Array.from({ length: 100 }, (_, index) =>
              String(value * 100 + index + 1)
            ).map((id) => ({
              id,
              revision: "2",
            })),
          })
        ),
      };
      const mockResponse2 = {
        results: Array.from({ length: 10 }, (_, index) => index).map(
          (value) => ({
            records: Array.from({ length: 100 }, (_, index) =>
              String(2000 + value * 100 + index + 1)
            ).map((id) => ({
              id,
              revision: "2",
            })),
          })
        ),
      };
      beforeEach(async () => {
        // response from first call of bulkRequest.send
        mockClient.mockResponse(mockResponse);
        // response from second call of bulkRequest.send
        mockClient.mockResponse(mockResponse2);
        response = await recordClient.updateAllRecords(params);
      });
      it("should call bulkRequest multiple times", () => {
        expect(mockClient.getLogs().length).toBe(2);
      });

      it("should return merged result of each bulkRequest's result", () => {
        const accumulateResponse = (
          acc: Array<{ id: string; revision: string }>,
          result: { records: Array<{ id: string; revision: string }> }
        ) => {
          return acc.concat(result.records);
        };

        const expected = [
          ...mockResponse.results,
          ...mockResponse2.results,
        ].reduce(accumulateResponse, []);
        expect(response.records).toStrictEqual(expected);
      });
    });

    describe("response error", () => {
      // success
      const mockResponse = {
        results: Array.from({ length: 20 }, (_, index) => index).map(
          (value) => ({
            records: Array.from({ length: 100 }, (_, index) =>
              String(value * 100 + index + 1)
            ).map((id) => ({
              id,
              revision: "2",
            })),
          })
        ),
      };
      // failed
      const errorResponse = {
        data: {
          results: [
            {},
            {},
            {
              id: "some id",
              code: "some code",
              message: "some error message",
              errors: {
                [`records[5].Customer`]: {
                  messages: ["key is missing"],
                },
              },
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
        },
        status: 500,
        statusText: "Internal Server Error",
        headers: {
          "X-Some-Header": "error",
        },
      };
      beforeEach(async () => {
        mockClient.mockResponse(mockResponse);
        mockClient.mockResponse(new KintoneRestAPIError(errorResponse));
      });
      it("should raise an KintoneAllRecordsError if an error occurs during bulkRequest", async () => {
        await expect(
          recordClient.updateAllRecords(params)
        ).rejects.toBeInstanceOf(KintoneAllRecordsError);
      });
    });
  });

  describe("deleteAllRecords", () => {
    const params = {
      app: APP_ID,
      records: Array.from({ length: 3000 }, (_, index) => index + 1).map(
        (value) => ({
          id: value,
          revision: 1,
        })
      ),
    };
    let response: any;
    describe("success", () => {
      const mockResponse = {
        results: Array.from({ length: 20 }, () => ({})),
      };
      const mockResponse2 = {
        results: Array.from({ length: 10 }, () => ({})),
      };
      beforeEach(async () => {
        // response from first call of bulkRequest.send
        mockClient.mockResponse(mockResponse);
        // response from second call of bulkRequest.send
        mockClient.mockResponse(mockResponse2);
        response = await recordClient.deleteAllRecords(params);
      });
      it("should call bulkRequest multiple times", () => {
        expect(mockClient.getLogs().length).toBe(2);
      });

      it("should return an empty object", () => {
        expect(response).toStrictEqual({});
      });
    });

    describe("response error", () => {
      // success
      const mockResponse = {
        results: Array.from({ length: 20 }, () => ({})),
      };
      // failed
      const errorResponse = {
        data: {
          results: [
            {},
            {},
            {
              id: "some id",
              code: "some code",
              message: "some error message",
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
        },
        status: 500,
        statusText: "Internal Server Error",
        headers: {
          "X-Some-Header": "error",
        },
      };
      beforeEach(async () => {
        mockClient.mockResponse(mockResponse);
        mockClient.mockResponse(new KintoneRestAPIError(errorResponse));
      });
      it("should raise an KintoneAllRecordsError if an error occurs during bulkRequest", async () => {
        await expect(
          recordClient.deleteAllRecords(params)
        ).rejects.toBeInstanceOf(KintoneAllRecordsError);
      });
    });
  });

  describe("addRecordComment", () => {
    const params = {
      app: APP_ID,
      record: RECORD_ID,
      comment: {
        text: "hello",
        mentions: [
          {
            code: "Administrator",
            type: "USER" as const,
          },
        ],
      },
    };
    beforeEach(async () => {
      await recordClient.addRecordComment(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/record/comment.json");
    });
    it("should send a post request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass app, record and comment to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("deleteRecordComment", () => {
    const params = {
      app: APP_ID,
      record: RECORD_ID,
      comment: "1",
    };
    beforeEach(async () => {
      await recordClient.deleteRecordComment(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/record/comment.json");
    });
    it("should send a delete request", () => {
      expect(mockClient.getLogs()[0].method).toBe("delete");
    });
    it("should pass app, record and comment to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("getRecordComments", () => {
    const params = {
      app: APP_ID,
      record: RECORD_ID,
      order: "desc" as const,
      offset: 5,
      limit: 5,
    };
    beforeEach(async () => {
      await recordClient.getRecordComments(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/record/comments.json");
    });
    it("should send a get request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass app, record, order, offset and limit to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("updateRecordAssignees", () => {
    const params = {
      app: APP_ID,
      id: RECORD_ID,
      assignees: ["user1"],
      revision: 10,
    };
    beforeEach(async () => {
      await recordClient.updateRecordAssignees(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/record/assignees.json");
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app, id, assignees, and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("updateRecordStatus", () => {
    const params = {
      action: "Action1",
      app: APP_ID,
      assignee: "user1",
      id: RECORD_ID,
      revision: 10,
    };
    beforeEach(async () => {
      await recordClient.updateRecordStatus(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/record/status.json");
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass action, app, assignee, id, and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("updateRecordsStatus", () => {
    const params = {
      app: APP_ID,
      records: [
        {
          action: "Action1",
          assignee: "user1",
          id: RECORD_ID,
          revision: 10,
        },
      ],
    };
    beforeEach(async () => {
      await recordClient.updateRecordsStatus(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/records/status.json");
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app and records to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});

describe("RecordClient with guestSpaceId", () => {
  it("should pass the path to the http client", async () => {
    const APP_ID = 1;
    const RECORD_ID = 2;
    const GUEST_SPACE_ID = 3;

    const requestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl: "https://example.cybozu.com",
      auth: { type: "session" },
    });
    const mockClient = buildMockClient(requestConfigBuilder);
    const bulkRequestClient = new BulkRequestClient(mockClient);
    const recordClient = new RecordClient(
      mockClient,
      bulkRequestClient,
      GUEST_SPACE_ID
    );
    const params = { app: APP_ID, id: RECORD_ID };
    await recordClient.getRecord(params);
    expect(mockClient.getLogs()[0].path).toBe(
      `/k/guest/${GUEST_SPACE_ID}/v1/record.json`
    );
  });
});
