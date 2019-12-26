import { RecordClient, Record } from "../RecordClient";
import { MockClient } from "../../http/MockClient";

describe("RecordClient", () => {
  let mockClient: MockClient;
  let recordClient: RecordClient;
  const APP_ID = 1;
  const RECORD_ID = 2;
  const fieldCode = "Customer";
  const record = {
    [fieldCode]: {
      value: "ABC Corporation"
    }
  };

  beforeEach(() => {
    mockClient = new MockClient();
    recordClient = new RecordClient(mockClient);
  });
  describe("getRecord", () => {
    const params = { app: APP_ID, id: RECORD_ID };
    beforeEach(() => {
      recordClient.getRecord(params);
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
    beforeEach(() => {
      recordClient.addRecord(params);
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
      revision: 5
    };
    beforeEach(() => {
      recordClient.updateRecord(params);
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

  describe("getRecords", () => {
    const params = {
      app: APP_ID,
      fields: [fieldCode],
      query: `${fieldCode} = "foo"`,
      totalCount: true
    };
    beforeEach(() => {
      recordClient.getRecords(params);
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

  describe("addRecords", () => {
    const params = { app: APP_ID, records: [record] };
    beforeEach(() => {
      recordClient.addRecords(params);
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
  });

  describe("updateRecords", () => {
    const params = {
      app: APP_ID,
      records: [{ id: RECORD_ID, record, revision: 5 }]
    };
    beforeEach(() => {
      recordClient.updateRecords(params);
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
      revisions
    };
    beforeEach(() => {
      recordClient.deleteRecords(params);
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
      size: 10
    };
    beforeEach(() => {
      recordClient.createCursor(params);
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
      id: "cursor id"
    };
    beforeEach(() => {
      recordClient.getRecordsByCursor(params);
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
      id: "cursor id"
    };
    beforeEach(() => {
      recordClient.deleteCursor(params);
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
          condition: `${fieldCode} = "foo"`
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithId<Record>(params);
        expect(mockClient.getLogs()[0].params.fields).toBe(undefined);
      });

      it("should do nothing if `fields` is empty", async () => {
        const params = {
          app: APP_ID,
          fields: [],
          condition: `${fieldCode} = "foo"`
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithId<Record>(params);
        expect(mockClient.getLogs()[0].params.fields).toEqual([]);
      });

      it("should append `$id` if `fields` is specified and doesn't contain `$id`", async () => {
        const params = {
          app: APP_ID,
          fields: [fieldCode],
          condition: `${fieldCode} = "foo"`
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
          condition: `${fieldCode} = "foo"`
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
        condition: `${fieldCode} = "foo"`
      };
      let result: Record[];

      beforeEach(async () => {
        const records = [];
        for (let i = 1; i <= 500; i++) {
          records.push({
            $id: {
              value: i.toString()
            }
          });
        }
        mockClient.mockResponse({ records });
        mockClient.mockResponse({ records: [{ $id: { value: "501" } }] });
        result = await recordClient.getAllRecordsWithId<Record>(params);
      });

      it("should return all records", () => {
        expect(mockClient.getLogs()[0]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: `${params.condition ||
              ""} and $id > 0 order by $id asc limit 500`
          }
        });
        expect(mockClient.getLogs()[1]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: `${params.condition ||
              ""} and $id > 500 order by $id asc limit 500`
          }
        });

        expect(result.length).toBe(501);
        expect(result[500]).toStrictEqual({ $id: { value: "501" } });
      });
    });

    describe("success without condition", () => {
      const params = {
        app: APP_ID,
        fields: ["$id"]
      };
      let result: Record[];

      beforeEach(async () => {
        const records = [];
        for (let i = 1; i <= 500; i++) {
          records.push({
            $id: {
              value: i.toString()
            }
          });
        }
        mockClient.mockResponse({ records });
        mockClient.mockResponse({ records: [{ $id: { value: "501" } }] });
        result = await recordClient.getAllRecordsWithId<Record>(params);
      });

      it("should return all records", () => {
        expect(mockClient.getLogs()[0]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: "$id > 0 order by $id asc limit 500"
          }
        });
        expect(mockClient.getLogs()[1]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: "$id > 500 order by $id asc limit 500"
          }
        });

        expect(result.length).toBe(501);
        expect(result[500]).toStrictEqual({ $id: { value: "501" } });
      });
    });
  });

  describe("getAllRecordsWithOffset", () => {
    describe("condition and orderBy parameters", () => {
      it("with condition and orderBy", async () => {
        const params = {
          app: APP_ID,
          condition: `${fieldCode} = "foo"`,
          orderBy: `${fieldCode} asc`
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
          condition: `${fieldCode} = "foo"`
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
          orderBy: `${fieldCode} asc`
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithOffset<Record>(params);
        expect(mockClient.getLogs()[0].params.query).toBe(
          `order by ${fieldCode} asc limit 500 offset 0`
        );
      });

      it("neither condition nor orderBy", async () => {
        const params = {
          app: APP_ID
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
        condition: `${fieldCode} = "foo"`
      };
      let result: Record[];

      beforeEach(async () => {
        const records = [];
        for (let i = 1; i <= 500; i++) {
          records.push({
            $id: {
              value: i.toString()
            }
          });
        }
        mockClient.mockResponse({ records });
        mockClient.mockResponse({ records: [{ $id: { value: "501" } }] });
        result = await recordClient.getAllRecordsWithOffset<Record>(params);
      });

      it("should return all records", () => {
        expect(mockClient.getLogs()[0]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: `${params.condition || ""} limit 500 offset 0`
          }
        });
        expect(mockClient.getLogs()[1]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: `${params.condition || ""} limit 500 offset 500`
          }
        });

        expect(result.length).toBe(501);
        expect(result[500]).toStrictEqual({ $id: { value: "501" } });
      });
    });
  });

  describe("getAllRecords", () => {
    describe("`orderBy` is specified", () => {
      const params = {
        app: APP_ID,
        condition: `${fieldCode} = "foo"`,
        orderBy: `${fieldCode} asc`
      };
      let withCursorMockFn: jest.Mock;
      let withOffsetMockFn: jest.Mock;
      beforeEach(() => {
        withCursorMockFn = jest.fn();
        withOffsetMockFn = jest.fn();
        recordClient.getAllRecordsWithCursor = withCursorMockFn;
        recordClient.getAllRecordsWithOffset = withOffsetMockFn;
      });
      it("should call `getAllRecordsWithCursor` if `withCursor` is not specified", () => {
        recordClient.getAllRecords({ ...params });
        expect(withCursorMockFn.mock.calls.length).toBe(1);
        expect(withCursorMockFn.mock.calls[0][0]).toStrictEqual({
          app: params.app,
          query: `${params.condition} order by ${params.orderBy}`
        });
      });
      it("should call `getAllRecordsWithCursor` if `withCursor` is true", () => {
        recordClient.getAllRecords({ ...params, withCursor: true });
        expect(withCursorMockFn.mock.calls.length).toBe(1);
        expect(withCursorMockFn.mock.calls[0][0]).toStrictEqual({
          app: params.app,
          query: `${params.condition} order by ${params.orderBy}`
        });
      });
      it("should call `getAllRecordsWithOffset` if `withCursor` is false", () => {
        recordClient.getAllRecords({ ...params, withCursor: false });
        expect(withOffsetMockFn.mock.calls.length).toBe(1);
        expect(withOffsetMockFn.mock.calls[0][0]).toStrictEqual(params);
      });
    });

    describe("`orderBy` is an empty string", () => {
      const params = {
        app: APP_ID,
        condition: `${fieldCode} = "foo"`,
        orderBy: ""
      };
      const { orderBy, ...expected } = params;
      let mockFn: jest.Mock;
      beforeEach(() => {
        mockFn = jest.fn();
        recordClient.getAllRecordsWithId = mockFn;
      });
      it("should call `getAllRecordsWithId` if `withCursor` is not specified", () => {
        recordClient.getAllRecords(params);
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(expected);
      });
      it("should call `getAllRecordsWithId` if `withCursor` is true", () => {
        recordClient.getAllRecords({ ...params, withCursor: true });
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(expected);
      });
      it("should call `getAllRecordsWithId` if `withCursor` is false", () => {
        recordClient.getAllRecords({ ...params, withCursor: false });
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(expected);
      });
    });
    describe("`orderBy` is not specified", () => {
      const params = {
        app: APP_ID,
        condition: `${fieldCode} = "foo"`
      };
      let mockFn: jest.Mock;
      beforeEach(() => {
        mockFn = jest.fn();
        recordClient.getAllRecordsWithId = mockFn;
      });
      it("should call `getAllRecordsWithId` if `withCursor` is not specified", () => {
        recordClient.getAllRecords(params);
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(params);
      });
      it("should call `getAllRecordsWithId` if `withCursor` is true", () => {
        recordClient.getAllRecords({ ...params, withCursor: true });
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(params);
      });
      it("should call `getAllRecordsWithId` if `withCursor` is false", () => {
        recordClient.getAllRecords({ ...params, withCursor: false });
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(params);
      });
    });
  });

  describe("getAllRecordsWithCursor", () => {
    const params = {
      app: APP_ID,
      fields: [fieldCode],
      query: `${fieldCode} = "foo"`
    };
    const CURSOR_ID = "1";
    let result: Record[];

    describe("success", () => {
      beforeEach(async () => {
        // response from createCursor
        mockClient.mockResponse({ id: CURSOR_ID, totalCount: "4" });
        // response from getRecordsByCursor
        mockClient.mockResponse({
          records: [{ id: 1 }, { id: 2 }],
          next: true
        });
        mockClient.mockResponse({
          records: [{ id: 3 }, { id: 4 }],
          next: false
        });
        result = await recordClient.getAllRecordsWithCursor<Record>(params);
      });

      it("should create a cursor", () => {
        expect(mockClient.getLogs()[0]).toEqual({
          path: "/k/v1/records/cursor.json",
          method: "post",
          params
        });
      });

      it("should return all records", () => {
        expect(mockClient.getLogs()[1]).toEqual({
          path: "/k/v1/records/cursor.json",
          method: "get",
          params: { id: CURSOR_ID }
        });
        expect(mockClient.getLogs()[2]).toEqual({
          path: "/k/v1/records/cursor.json",
          method: "get",
          params: { id: CURSOR_ID }
        });
        expect(result).toStrictEqual([
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 }
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
          next: true
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
          params: { id: CURSOR_ID }
        });
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
            type: "USER" as const
          }
        ]
      }
    };
    beforeEach(() => {
      recordClient.addRecordComment(params);
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
      comment: "1"
    };
    beforeEach(() => {
      recordClient.deleteRecordComment(params);
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
      limit: 5
    };
    beforeEach(() => {
      recordClient.getRecordComments(params);
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

  describe("updateAssignees", () => {
    const params = {
      app: APP_ID,
      id: RECORD_ID,
      assignees: ["user1"],
      revision: 10
    };
    beforeEach(() => {
      recordClient.updateAssignees(params);
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

  describe("updateStatus", () => {
    const params = {
      action: "Action1",
      app: APP_ID,
      assignee: "user1",
      id: RECORD_ID,
      revision: 10
    };
    beforeEach(() => {
      recordClient.updateStatus(params);
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

  describe("updateStatuses", () => {
    const params = {
      app: APP_ID,
      records: [
        {
          action: "Action1",
          assignee: "user1",
          id: RECORD_ID,
          revision: 10
        }
      ]
    };
    beforeEach(() => {
      recordClient.updateStatuses(params);
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
