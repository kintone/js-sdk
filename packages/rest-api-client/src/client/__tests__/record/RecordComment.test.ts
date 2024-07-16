import type { MockClient } from "../../../http/MockClient";
import type { RecordClient } from "../../RecordClient";
import {
  APP_ID,
  makeClients,
  RECORD_ID,
} from "../fixtures/RecordClientFixture";

describe("RecordComment", () => {
  let mockClient: MockClient;
  let recordClient: RecordClient;

  beforeEach(() => {
    const clients = makeClients();
    recordClient = clients.recordClient;
    mockClient = clients.mockClient;
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
});
