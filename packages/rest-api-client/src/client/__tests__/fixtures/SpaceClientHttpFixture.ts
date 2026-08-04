import { SpaceClient } from "../../SpaceClient";
import type { SpaceID } from "../../types";
import { makeHttpTestClient } from "./HttpClientTestHarness";

/**
 * Wires a real SpaceClient to a real AxiosClient talking to a real local HTTP server,
 * so these tests assert on the actual wire format (URL, query string, JSON body,
 * headers) instead of calls to an internal MockClient.
 */
export const makeHttpClients = (guestSpaceId?: SpaceID) => {
  const { httpClient, httpServer } = makeHttpTestClient();
  const spaceClient = new SpaceClient(httpClient, guestSpaceId);
  return {
    spaceClient,
    httpServer,
  };
};

export { API_TOKEN, expectRequest, wireParams } from "./HttpClientTestHarness";
