import { APP_ID, makeClients } from "./fixtures/AppClientFixture";

describe("AppClient with guestSpaceId", () => {
  it("should pass the path to the http client", async () => {
    const GUEST_SPACE_ID = 2;
    const clients = makeClients(GUEST_SPACE_ID);
    const appClient = clients.appClient;
    const mockClient = clients.mockClient;
    const lang = "default";
    const params = { app: APP_ID, lang } as const;

    await appClient.getFormFields(params);
    expect(mockClient.getLogs()[0].path).toBe(
      `/k/guest/${GUEST_SPACE_ID}/v1/app/form/fields.json`,
    );
  });
});
