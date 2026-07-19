import os from "os";
import { AxiosClient } from "../../../http/AxiosClient";
import { KintoneRequestConfigBuilder } from "../../../KintoneRequestConfigBuilder";
import { KintoneResponseHandler } from "../../../KintoneResponseHandler";
import { HttpTestServer } from "./HttpTestServer";

const packageJson = require("../../../../package.json");

export const API_TOKEN = "foo";

// Computed the same way KintoneRequestConfigBuilder builds it, so this stays exact
// across environments instead of being pinned to one Node/OS/package version.
const EXPECTED_USER_AGENT = `Node.js/${process.version}(${os.type()}) ${
  packageJson.name
}@${packageJson.version}`;

// These are set by the underlying HTTP client (Axios today), not by the SDK's
// client classes themselves. They're asserted anyway (full header equality, not
// just the SDK-owned ones) so that when the planned Axios -> fetch migration
// changes any of them, the diff shows up here explicitly instead of being
// silently ignored.
const AXIOS_DEFAULT_ACCEPT = "application/json, text/plain, */*";
const AXIOS_DEFAULT_ACCEPT_ENCODING = "gzip, compress, deflate, br";
const AXIOS_DEFAULT_CONNECTION = "close";

const expectedHeaders = (options: { host: string; body?: any }) => {
  const hasBody = options.body !== undefined;
  return {
    accept: AXIOS_DEFAULT_ACCEPT,
    "accept-encoding": AXIOS_DEFAULT_ACCEPT_ENCODING,
    connection: AXIOS_DEFAULT_CONNECTION,
    host: options.host,
    "user-agent": EXPECTED_USER_AGENT,
    "x-cybozu-api-token": API_TOKEN,
    ...(hasBody
      ? {
          "content-type": "application/json",
          "content-length": String(
            Buffer.byteLength(JSON.stringify(options.body)),
          ),
        }
      : {}),
  };
};

/**
 * Asserts a captured request's full, deterministic shape in one go: method, path,
 * query/body, and every header on the wire (including the ones Axios sets, not just
 * the ones the SDK's client classes set) via toStrictEqual. That's deliberate: it
 * makes any header difference introduced by the planned Axios -> fetch migration
 * show up as an explicit diff here, instead of being missed by only checking a
 * hand-picked subset.
 */
export const expectRequest = (
  httpServer: HttpTestServer,
  index: number,
  expected: {
    method: string;
    path: string;
    query?: Record<string, any>;
    body?: any;
  },
) => {
  const log = httpServer.getLogs()[index];
  const host = new URL(httpServer.baseUrl).host;
  expect(log).toStrictEqual({
    method: expected.method,
    path: expected.path,
    query: expected.query ?? {},
    body: expected.body,
    headers: expectedHeaders({ host, body: expected.body }),
  });
};

/**
 * Builds a real AxiosClient wired to a fresh, unique HttpTestServer. Use this to
 * construct any BaseClient subclass (AppClient, SpaceClient, ...) for HTTP-level
 * tests, instead of the MockClient used by the piecemeal fixtures.
 */
export const makeHttpTestClient = () => {
  const httpServer = new HttpTestServer();
  httpServer.listen();
  const requestConfigBuilder = new KintoneRequestConfigBuilder({
    baseUrl: httpServer.baseUrl,
    auth: { type: "apiToken", apiToken: API_TOKEN },
  });
  const responseHandler = new KintoneResponseHandler({
    enableAbortSearchError: false,
  });
  const httpClient = new AxiosClient({ responseHandler, requestConfigBuilder });
  return { httpClient, httpServer };
};

export { wireParams } from "./HttpTestServer";
