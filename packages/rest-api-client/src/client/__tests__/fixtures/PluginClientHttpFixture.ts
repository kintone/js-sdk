import { PluginClient } from "../../PluginClient";
import { makeHttpTestClient } from "./HttpClientTestHarness";

/**
 * Wires a real PluginClient to a real AxiosClient talking to a real local HTTP server,
 * so these tests assert on the actual wire format (URL, query string, JSON body,
 * headers) instead of calls to an internal MockClient.
 */
export const makeHttpClients = () => {
  const { httpClient, httpServer } = makeHttpTestClient();
  const pluginClient = new PluginClient(httpClient);
  return {
    pluginClient,
    httpServer,
  };
};

export { API_TOKEN, expectRequest, wireParams } from "./HttpClientTestHarness";
