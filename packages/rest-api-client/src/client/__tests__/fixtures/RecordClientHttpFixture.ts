import { BulkRequestClient } from "../../BulkRequestClient";
import { RecordClient } from "../../RecordClient";
import type { SpaceID } from "../../types";
import { makeHttpTestClient } from "./HttpClientTestHarness";

/**
 * Wires a real RecordClient (and the BulkRequestClient it depends on) to a real
 * AxiosClient talking to a real local HTTP server, so these tests assert on the
 * actual wire format (URL, query string, JSON body, headers) instead of calls to
 * an internal MockClient. Mirrors how KintoneRestAPIClient wires these two up
 * (guestSpaceId passed to both).
 */
export const makeHttpClients = (guestSpaceId?: SpaceID) => {
  const { httpClient, httpServer } = makeHttpTestClient();
  const bulkRequestClient = new BulkRequestClient(httpClient, guestSpaceId);
  const recordClient = new RecordClient(
    httpClient,
    bulkRequestClient,
    guestSpaceId,
  );
  return {
    recordClient,
    httpServer,
  };
};

export { API_TOKEN, expectRequest, wireParams } from "./HttpClientTestHarness";
export { APP_ID, RECORD_ID, fieldCode, record } from "./RecordClientFixture";
