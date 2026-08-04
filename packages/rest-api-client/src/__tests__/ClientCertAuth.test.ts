import fs from "node:fs";
import path from "node:path";
import { KintoneRestAPIClient } from "../KintoneRestAPIClient";

// A throwaway self-signed cert, not tied to any real service. Regenerate with:
//   openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 3650 \
//     -nodes -subj "/CN=kintone-js-sdk-test-client"
//   openssl pkcs12 -export -out dummy-client-cert.pfx -inkey key.pem -in cert.pem \
//     -passout pass:correct-passphrase
// (key.pem/cert.pem are discarded; only the PFX is committed.)
const PFX_PATH = path.join(
  __dirname,
  "fixtures/clientCertAuth/dummy-client-cert.pfx",
);
const CORRECT_PASSPHRASE = "correct-passphrase";

describe("clientCertAuth", () => {
  // No mock server involved: decrypting the PFX with the wrong passphrase
  // fails inside Node's TLS/crypto layer before any socket is opened, so this
  // reproduces the real "mac verify failure" error without any network I/O.
  it("raises a friendly error when the PFX passphrase is wrong", async () => {
    const client = new KintoneRestAPIClient({
      baseUrl: "https://127.0.0.1:9999",
      auth: { apiToken: "dummy-token" },
      clientCertAuth: {
        pfx: fs.readFileSync(PFX_PATH),
        password: "wrong-passphrase",
      },
    });

    await expect(client.app.getApp({ id: 1 })).rejects.toThrow(
      "invalid clientCertAuth setting",
    );
  });

  // Control case: proves the fixture PFX and passphrase are valid, so the test
  // above is really exercising a passphrase mismatch and not a broken fixture.
  it("does not raise a clientCertAuth error when the passphrase is correct", async () => {
    const client = new KintoneRestAPIClient({
      baseUrl: "https://127.0.0.1:9999",
      auth: { apiToken: "dummy-token" },
      clientCertAuth: {
        pfx: fs.readFileSync(PFX_PATH),
        password: CORRECT_PASSPHRASE,
      },
    });

    await expect(client.app.getApp({ id: 1 })).rejects.not.toThrow(
      "invalid clientCertAuth setting",
    );
  });
});
