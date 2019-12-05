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

  describe("getAllRecordsWithCursor", () => {
    const params = {
      app: APP_ID,
      fields: [fieldCode],
      query: `${fieldCode} = "foo"`
    };
    const CURSOR_ID = "1";
    let result: { records: Record[]; totalCount: string };

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
        expect(result.records).toStrictEqual([
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 }
        ]);
        expect(result.totalCount).toBe("4");
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
        mockClient.mockResponse(new Error("fail getting"));
      });

      it("should raise error", async () => {
        await expect(
          recordClient.getAllRecordsWithCursor<Record>(params)
        ).rejects.toThrow("fail getting");
        expect(mockClient.getLogs()[3]).toStrictEqual({
          path: "/k/v1/records/cursor.json",
          method: "delete",
          params: { id: CURSOR_ID }
        });
      });
    });
  });

  describe("addComment", () => {
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
      recordClient.addComment(params);
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

  describe("deleteComment", () => {
    const params = {
      app: APP_ID,
      record: RECORD_ID,
      comment: "1"
    };
    beforeEach(() => {
      recordClient.deleteComment(params);
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

  describe("getComments", () => {
    const params = {
      app: APP_ID,
      record: RECORD_ID,
      order: "desc" as const,
      offset: 5,
      limit: 5
    };
    beforeEach(() => {
      recordClient.getComments(params);
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
