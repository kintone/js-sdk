import { APP_ID, makeClients, RECORD_ID } from "./fixtures/RecordClientFixture";

describe("RecordClient with guestSpaceId", () => {
  it("should pass the path to the http client", async () => {
    const GUEST_SPACE_ID = 3;

    const clients = makeClients(GUEST_SPACE_ID);
    const recordClient = clients.recordClient;
    const mockClient = clients.mockClient;

    const params = { app: APP_ID, id: RECORD_ID };
    await recordClient.getRecord(params);
    expect(mockClient.getLogs()[0].path).toBe(
      `/k/guest/${GUEST_SPACE_ID}/v1/record.json`,
    );
  });
});
