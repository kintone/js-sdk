import { AppClient } from "../../AppClient";
import type { SpaceID } from "../../types";
import { makeHttpTestClient } from "./HttpClientTestHarness";

/**
 * Wires a real AppClient to a real AxiosClient talking to a real local HTTP server,
 * instead of the MockClient used by the other AppClient test fixtures.
 * This exercises the actual wire format (URL, query string, JSON body, headers)
 * so these tests keep protecting AppClient's behavior if the underlying
 * HttpClient implementation changes (e.g. Axios -> fetch).
 */
export const makeHttpClients = (guestSpaceId?: SpaceID) => {
  const { httpClient, httpServer } = makeHttpTestClient();
  const appClient = new AppClient(httpClient, guestSpaceId);
  return {
    appClient,
    httpServer,
  };
};

export { API_TOKEN, expectRequest, wireParams } from "./HttpClientTestHarness";
export { APP_ID, REVISION } from "./AppClientFixture";
