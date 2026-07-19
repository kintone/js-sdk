import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { RecordClient } from "../../RecordClient";
import {
  APP_ID,
  expectRequest,
  makeHttpClients,
  RECORD_ID,
} from "../fixtures/RecordClientHttpFixture";

describe("RecordStatusTest (HTTP level)", () => {
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/record/status.json",
        body: params,
      });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/records/status.json",
        body: params,
      });
    });
  });
});
