import type { MockClient } from "../../../http/MockClient";
import type { RecordClient } from "../../RecordClient";
import {
  APP_ID,
  makeClients,
  RECORD_ID,
} from "../fixtures/RecordClientFixture";

describe("RecordStatusTest", () => {
  let mockClient: MockClient;
  let recordClient: RecordClient;

  beforeEach(() => {
    const clients = makeClients();
    recordClient = clients.recordClient;
    mockClient = clients.mockClient;
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
