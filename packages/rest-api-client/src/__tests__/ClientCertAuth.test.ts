import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import type { AddressInfo } from "node:net";
import type { TLSSocket } from "node:tls";
import { KintoneRestAPIClient } from "../KintoneRestAPIClient";

const FIXTURES_DIR = path.join(__dirname, "fixtures/clientCertAuth");

// A throwaway self-signed cert, not tied to any real service. Regenerate with:
//   openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 3650 \
//     -nodes -subj "/CN=kintone-js-sdk-test-client"
//   openssl pkcs12 -export -out dummy-client-cert.pfx -inkey key.pem -in cert.pem \
//     -passout pass:correct-passphrase
// (key.pem is discarded; the PFX and the extracted-from-it public cert below
// are committed.)
const PFX_PATH = path.join(FIXTURES_DIR, "dummy-client-cert.pfx");
const CORRECT_PASSPHRASE = "correct-passphrase";

// The same cert bundled in the PFX above, in PEM form so a test server can
// list it as a trusted CA (a self-signed cert can verify a peer presenting
// that exact cert). Re-extract after regenerating the PFX with:
//   openssl pkcs12 -in dummy-client-cert.pfx -clcerts -nokeys \
//     -passin pass:correct-passphrase | openssl x509 > dummy-client-cert.pem
const CLIENT_CERT_PEM_PATH = path.join(FIXTURES_DIR, "dummy-client-cert.pem");

// A throwaway self-signed server identity for the mTLS test below, unrelated
// to the client cert above. Regenerate with:
//   openssl req -x509 -newkey rsa:2048 -keyout dummy-mtls-server-key.pem \
//     -out dummy-mtls-server-cert.pem -days 3650 -nodes -subj "/CN=localhost"
const SERVER_CERT_PATH = path.join(FIXTURES_DIR, "dummy-mtls-server-cert.pem");
const SERVER_KEY_PATH = path.join(FIXTURES_DIR, "dummy-mtls-server-key.pem");

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

  // Unlike the two tests above (which only check whether a passphrase-related
  // error is thrown), this spins up a real server that requires and verifies
  // a client certificate, so it proves the SDK actually presents a usable
  // client cert during the TLS handshake -- not just that the connection
  // fails for some other reason (e.g. ECONNREFUSED) before ever reaching one.
  it("completes a real mTLS handshake and lets the server verify the client cert", async () => {
    let socketAuthorized: boolean | undefined;
    let peerCommonName: string | undefined;

    const server = https.createServer(
      {
        cert: fs.readFileSync(SERVER_CERT_PATH),
        key: fs.readFileSync(SERVER_KEY_PATH),
        requestCert: true,
        rejectUnauthorized: true,
        ca: [fs.readFileSync(CLIENT_CERT_PEM_PATH)],
      },
      (req, res) => {
        const socket = req.socket as TLSSocket;
        socketAuthorized = socket.authorized;
        peerCommonName = socket.getPeerCertificate()?.subject?.CN;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({}));
      },
    );
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    const { port } = server.address() as AddressInfo;

    // clientCertAuth has no way to pass a custom CA for the *server's* own
    // certificate (only the separate httpsAgent option supports that, via
    // buildTlsOptions), so this is the only way to get the client past this
    // throwaway self-signed test server. It's orthogonal to what's under
    // test: it only affects whether the client trusts the server's
    // certificate, not whether the server verifies the client's.
    const originalRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {
      const client = new KintoneRestAPIClient({
        baseUrl: `https://127.0.0.1:${port}`,
        auth: { apiToken: "dummy-token" },
        clientCertAuth: {
          pfx: fs.readFileSync(PFX_PATH),
          password: CORRECT_PASSPHRASE,
        },
      });

      await client.app.getApp({ id: 1 });

      expect(socketAuthorized).toBe(true);
      expect(peerCommonName).toBe("kintone-js-sdk-test-client");
    } finally {
      // Restoring a saved snapshot, not racing a concurrent read of the same env var.
      // eslint-disable-next-line require-atomic-updates
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalRejectUnauthorized;
      server.close();
    }
  });
});
