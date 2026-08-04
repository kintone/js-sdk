import { BulkRequestClient } from "../../BulkRequestClient";
import type { SpaceID } from "../../types";
import { makeHttpTestClient } from "./HttpClientTestHarness";

/**
 * Wires a real BulkRequestClient to a real AxiosClient talking to a real local HTTP
 * server, so these tests assert on the actual wire format (URL, query string, JSON
 * body, headers) instead of calls to an internal MockClient.
 */
export const makeHttpClients = (guestSpaceId?: SpaceID) => {
  const { httpClient, httpServer } = makeHttpTestClient();
  const bulkRequestClient = new BulkRequestClient(httpClient, guestSpaceId);
  return {
    bulkRequestClient,
    httpServer,
  };
};

export { API_TOKEN, expectRequest, wireParams } from "./HttpClientTestHarness";
