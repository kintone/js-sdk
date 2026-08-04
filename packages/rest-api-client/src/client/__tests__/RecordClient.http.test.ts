import {
  APP_ID,
  RECORD_ID,
  expectRequest,
  makeHttpClients,
  wireParams,
} from "./fixtures/RecordClientHttpFixture";

describe("RecordClient with guestSpaceId (HTTP level)", () => {
  it("should send the guest space path over the wire", async () => {
    const GUEST_SPACE_ID = 3;
    const clients = makeHttpClients(GUEST_SPACE_ID);
    const recordClient = clients.recordClient;
    const httpServer = clients.httpServer;

    try {
      const params = { app: APP_ID, id: RECORD_ID };
      await recordClient.getRecord(params);
      expectRequest(httpServer, 0, {
        method: "get",
        path: `/k/guest/${GUEST_SPACE_ID}/v1/record.json`,
        query: wireParams(params),
      });
    } finally {
      httpServer.close();
    }
  });
});
