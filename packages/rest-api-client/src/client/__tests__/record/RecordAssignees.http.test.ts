import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { RecordClient } from "../../RecordClient";
import {
  APP_ID,
  expectRequest,
  makeHttpClients,
  RECORD_ID,
} from "../fixtures/RecordClientHttpFixture";

describe("RecordAssigneesTest (HTTP level)", () => {
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/record/assignees.json",
        body: params,
      });
    });
  });
});
