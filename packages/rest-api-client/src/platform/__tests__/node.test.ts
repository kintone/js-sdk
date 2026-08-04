import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { buildPlatformDependentConfig } from "../node";

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
