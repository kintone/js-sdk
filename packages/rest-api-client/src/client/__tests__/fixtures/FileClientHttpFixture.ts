import { FileClient } from "../../FileClient";
import { makeHttpTestClient } from "./HttpClientTestHarness";

/**
 * Wires a real FileClient to a real AxiosClient talking to a real local HTTP server,
 * so these tests assert on the actual wire format (URL, query string, multipart
 * body, binary response, headers) instead of calls to an internal MockClient.
 */
export const makeHttpClients = (guestSpaceId?: number | string) => {
  const { httpClient, httpServer } = makeHttpTestClient();
  const fileClient = new FileClient(httpClient, guestSpaceId);
  return {
    fileClient,
    httpServer,
  };
};

export { API_TOKEN, expectRequest, wireParams } from "./HttpClientTestHarness";
