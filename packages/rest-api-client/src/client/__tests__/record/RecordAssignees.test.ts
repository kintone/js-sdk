import type { MockClient } from "../../../http/MockClient";
import type { RecordClient } from "../../RecordClient";
import {
  APP_ID,
  makeClients,
  RECORD_ID,
} from "../fixtures/RecordClientFixture";

describe("RecordAssigneesTest", () => {
  let mockClient: MockClient;
  let recordClient: RecordClient;

  beforeEach(() => {
    const clients = makeClients();
    recordClient = clients.recordClient;
    mockClient = clients.mockClient;
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
});
