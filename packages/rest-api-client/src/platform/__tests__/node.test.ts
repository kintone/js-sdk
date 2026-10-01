import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import FormData from "form-data";
import { Agent } from "undici";
import {
  buildAgentConnectionOptions,
  buildFetchDispatcher,
  buildFetchFormData,
} from "../node";

const PFX_PATH = path.join(
  __dirname,
  "../../__tests__/fixtures/clientCertAuth/dummy-client-cert.pfx",
);

describe("buildAgentConnectionOptions", () => {
  it("maps a caller-supplied httpsAgent's maxSockets to connections", () => {
    const httpsAgent = new https.Agent({ maxSockets: 5 });
    expect(buildAgentConnectionOptions(httpsAgent)).toStrictEqual({
      connections: 5,
    });
  });

  it("returns undefined when maxSockets is not set", () => {
    expect(buildAgentConnectionOptions(new https.Agent())).toBeUndefined();
    expect(buildAgentConnectionOptions(undefined)).toBeUndefined();
  });
});

describe("buildFetchDispatcher", () => {
  it("returns undefined when nothing is specified", () => {
    expect(buildFetchDispatcher({})).toBeUndefined();
  });

  // Regression test: a caller-supplied httpsAgent with no TLS-related
  // options (e.g. one built only for connection pooling, like `keepAlive`)
  // used to produce no dispatcher at all, silently falling back to Node's
  // global fetch with the agent completely ignored.
  it("still builds a dispatcher for an httpsAgent with no TLS options", () => {
    const httpsAgent = new https.Agent({ keepAlive: true });
    expect(buildFetchDispatcher({ httpsAgent })).toBeInstanceOf(Agent);
  });

  it("builds a dispatcher carrying the pfx buffer and passphrase from clientCertAuth", () => {
    const pfx = fs.readFileSync(PFX_PATH);
    expect(
      buildFetchDispatcher({
        clientCertAuth: { pfx, password: "correct-passphrase" },
      }),
    ).toBeInstanceOf(Agent);
  });

  it("builds a dispatcher when only socketTimeout is specified", () => {
    expect(buildFetchDispatcher({ socketTimeout: 5000 })).toBeInstanceOf(Agent);
  });
});

describe("buildFetchFormData", () => {
  // A `fs.createReadStream()` field (documented in docs/file.md as a valid
  // `file.data`) can only be read once. If this ever regresses to returning
  // the stream itself (or a ReadableStream wrapper) instead of a buffered
  // Buffer, a 307/308 redirect resend would ship an empty second request --
  // this is the same regression FileUploadRedirect.http.test.ts guards
  // end-to-end via a real server (msw can't simulate it, see RedirectTestServer).
  it("buffers a Stream field into a resendable Buffer, not a stream", async () => {
    const fd = new FormData();
    fd.append("file", fs.createReadStream(PFX_PATH), { filename: "cert.pfx" });
    fd.append("field", "hello");

    const result = await buildFetchFormData(fd);

    expect(result).not.toBeNull();
    expect(Buffer.isBuffer(result?.body)).toBe(true);
  });
});
