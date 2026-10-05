import os from "os";
import { FetchClient } from "../../../http/FetchClient";
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

// Only SDK-owned headers are checked here. Headers that used to be asserted
// because Axios set them by default (accept, accept-encoding, connection,
// host, content-length) are NOT observable through msw's fetch interceptor:
// msw captures the Request object as fetch() constructs it, before undici's
// dispatcher fills in those defaults on the actual wire send. A real TCP
// capture confirms undici does still send them when this SDK runs for real
// (with different defaults than Axios had -- e.g. connection: keep-alive
// instead of close, accept-encoding without "br"), so this is a limitation
// of testing through msw, not a behavior change worth asserting here.
const expectedHeaders = (options: { body?: any }) => {
  const hasBody = options.body !== undefined;
  return {
    "user-agent": EXPECTED_USER_AGENT,
    "x-cybozu-api-token": API_TOKEN,
    ...(hasBody
      ? {
          "content-type": "application/json",
        }
      : {}),
  };
};

/**
 * Asserts a captured request's full, deterministic shape in one go: method, path,
 * query/body, and the SDK-owned headers, via toStrictEqual.
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
  expect(log).toStrictEqual({
    method: expected.method,
    path: expected.path,
    query: expected.query ?? {},
    body: expected.body,
    headers: expectedHeaders({ body: expected.body }),
  });
};

/**
 * Builds a real FetchClient talking to the given baseUrl. Shared by
 * makeHttpTestClient (baseUrl backed by the msw-based HttpTestServer) and
 * tests that need a real TCP server instead (e.g. FileUploadRedirect.http.test.ts,
 * which msw can't support -- see its comment).
 */
export const makeFetchHttpClient = (baseUrl: string) => {
  const requestConfigBuilder = new KintoneRequestConfigBuilder({
    baseUrl,
    auth: { type: "apiToken", apiToken: API_TOKEN },
  });
  const responseHandler = new KintoneResponseHandler({
    enableAbortSearchError: false,
  });
  return new FetchClient({ responseHandler, requestConfigBuilder });
};

/**
 * Builds a real FetchClient wired to a fresh, unique HttpTestServer. Use this to
 * construct any BaseClient subclass (AppClient, SpaceClient, ...) for HTTP-level
 * tests, instead of the MockClient used by the piecemeal fixtures.
 */
export const makeHttpTestClient = () => {
  const httpServer = new HttpTestServer();
  httpServer.listen();
  const httpClient = makeFetchHttpClient(httpServer.baseUrl);
  return { httpClient, httpServer };
};

export { wireParams } from "./HttpTestServer";
