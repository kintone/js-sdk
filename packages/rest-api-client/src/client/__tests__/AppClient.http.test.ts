import {
  APP_ID,
  expectRequest,
  makeHttpClients,
  wireParams,
} from "./fixtures/AppClientHttpFixture";

describe("AppClient with guestSpaceId (HTTP level)", () => {
  it("should send the guest space path over the wire", async () => {
    const GUEST_SPACE_ID = 2;
    const clients = makeHttpClients(GUEST_SPACE_ID);
    const appClient = clients.appClient;
    const httpServer = clients.httpServer;
    const lang = "default";
    const params = { app: APP_ID, lang } as const;

    try {
      await appClient.getFormFields(params);
      expectRequest(httpServer, 0, {
        method: "get",
        path: `/k/guest/${GUEST_SPACE_ID}/v1/app/form/fields.json`,
        query: wireParams(params),
      });
    } finally {
      httpServer.close();
    }
  });

  it("should return the parsed JSON response the server sent", async () => {
    const clients = makeHttpClients();
    const appClient = clients.appClient;
    const httpServer = clients.httpServer;

    try {
      httpServer.mockResponse({ appId: String(APP_ID), name: "app" });
      await expect(appClient.getApp({ id: APP_ID })).resolves.toStrictEqual({
        appId: String(APP_ID),
        name: "app",
      });
    } finally {
      httpServer.close();
    }
  });
});
