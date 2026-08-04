import { SearchClient } from "../../SearchClient";
import type { SpaceID } from "../../types";
import { makeHttpTestClient } from "./HttpClientTestHarness";

/**
 * Wires a real SearchClient to a real AxiosClient talking to a real local HTTP server,
 * so these tests assert on the actual wire format (URL, query string, JSON body,
 * headers) instead of calls to an internal MockClient.
 */
export const makeHttpClients = (guestSpaceId?: SpaceID) => {
  const { httpClient, httpServer } = makeHttpTestClient();
  const searchClient = new SearchClient(httpClient, guestSpaceId);
  return {
    searchClient,
    httpServer,
  };
};

export { API_TOKEN, expectRequest, wireParams } from "./HttpClientTestHarness";
