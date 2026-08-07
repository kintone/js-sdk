import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import FormData from "form-data";
import { buildFetchFormData, buildPlatformDependentConfig } from "../node";

const PFX_PATH = path.join(
  __dirname,
  "../../__tests__/fixtures/clientCertAuth/dummy-client-cert.pfx",
);

describe("buildPlatformDependentConfig", () => {
  it("returns an empty config when nothing is specified", () => {
    expect(buildPlatformDependentConfig({})).toStrictEqual({});
  });

  it("passes a caller-supplied httpsAgent through unchanged", () => {
    const httpsAgent = new https.Agent();
    expect(buildPlatformDependentConfig({ httpsAgent })).toStrictEqual({
      httpsAgent,
    });
  });

  it("builds an https.Agent carrying the pfx buffer and passphrase from clientCertAuth", () => {
    const pfx = fs.readFileSync(PFX_PATH);
    const { httpsAgent } = buildPlatformDependentConfig({
      clientCertAuth: { pfx, password: "correct-passphrase" },
    }) as { httpsAgent: https.Agent };

    expect(httpsAgent).toBeInstanceOf(https.Agent);
    expect(httpsAgent.options.pfx).toBe(pfx);
    expect(httpsAgent.options.passphrase).toBe("correct-passphrase");
  });

  it("reads the pfx from disk when clientCertAuth is given a pfxFilePath", () => {
    const { httpsAgent } = buildPlatformDependentConfig({
      clientCertAuth: { pfxFilePath: PFX_PATH, password: "correct-passphrase" },
    }) as { httpsAgent: https.Agent };

    expect(
      (httpsAgent.options.pfx as Buffer).equals(fs.readFileSync(PFX_PATH)),
    ).toBe(true);
  });

  it("prefers httpsAgent over clientCertAuth when both are given", () => {
    const httpsAgent = new https.Agent();
    const pfx = fs.readFileSync(PFX_PATH);
    expect(
      buildPlatformDependentConfig({
        httpsAgent,
        clientCertAuth: { pfx, password: "correct-passphrase" },
      }),
    ).toStrictEqual({ httpsAgent });
  });

  it("carries socketTimeout through as the request timeout", () => {
    expect(buildPlatformDependentConfig({ socketTimeout: 5000 })).toStrictEqual(
      { timeout: 5000 },
    );
  });

  it("combines an httpsAgent with socketTimeout", () => {
    const httpsAgent = new https.Agent();
    expect(
      buildPlatformDependentConfig({ httpsAgent, socketTimeout: 5000 }),
    ).toStrictEqual({ httpsAgent, timeout: 5000 });
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
