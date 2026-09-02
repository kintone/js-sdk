import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import path from "node:path";
import type { AddressInfo } from "node:net";
import type { TLSSocket } from "node:tls";
import { KintoneRestAPIClient } from "../KintoneRestAPIClient";

const FIXTURES_DIR = path.join(__dirname, "fixtures/clientCertAuth");
const PFX_PATH = path.join(FIXTURES_DIR, "dummy-client-cert.pfx");
const CORRECT_PASSPHRASE = "correct-passphrase";
const CLIENT_CERT_PEM_PATH = path.join(FIXTURES_DIR, "dummy-client-cert.pem");
const SERVER_CERT_PATH = path.join(FIXTURES_DIR, "dummy-mtls-server-cert.pem");
const SERVER_KEY_PATH = path.join(FIXTURES_DIR, "dummy-mtls-server-key.pem");

describe("proxy", () => {
  it("routes the request through the configured proxy instead of connecting directly", async () => {
    const proxyRequests: string[] = [];
    // A real forward proxy: it receives the absolute-URI request line
    // ("GET http://target-host:port/path HTTP/1.1") that a proxy-aware
    // client sends, rather than the origin-form ("GET /path HTTP/1.1") a
    // direct connection would send.
    const proxyServer = http.createServer((req, res) => {
      proxyRequests.push(req.url ?? "");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ appId: "1", name: "app" }));
    });
    await new Promise<void>((resolve) =>
      proxyServer.listen(0, "127.0.0.1", resolve),
    );
    const proxyPort = (proxyServer.address() as AddressInfo).port;

    // Nothing listens here: the baseUrl target is only ever reachable via
    // the proxy above, so a successful response proves the proxy config
    // was actually honored rather than connecting directly. Allocated (then
    // immediately freed) instead of hardcoded, to avoid clashing with
    // anything already bound on a fixed port.
    const unreachableTargetPort = await new Promise<number>((resolve) => {
      const probe = http.createServer();
      probe.listen(0, "localhost", () => {
        const { port } = probe.address() as AddressInfo;
        probe.close(() => resolve(port));
      });
    });

    try {
      const client = new KintoneRestAPIClient({
        baseUrl: `http://localhost:${unreachableTargetPort}`,
        auth: { apiToken: "dummy-token" },
        proxy: { host: "127.0.0.1", port: proxyPort, protocol: "http" },
      });

      const result = await client.app.getApp({ id: 1 });

      expect(result).toStrictEqual({ appId: "1", name: "app" });
      expect(proxyRequests).toHaveLength(1);
      expect(proxyRequests[0]).toBe(
        `http://localhost:${unreachableTargetPort}/k/v1/app.json?id=1`,
      );
    } finally {
      proxyServer.close();
    }
  });

  // Regression test for the axios-era behavior (`buildProxyConfig`, removed
  // when the dead `RequestConfig.proxy` field was deleted): a blank
  // username/password means "no auth", not "authenticate with an empty
  // credential".
  it("omits Proxy-Authorization when proxy.auth has a blank username or password", async () => {
    const proxyAuthHeaders: Array<string | undefined> = [];
    const proxyServer = http.createServer((req, res) => {
      proxyAuthHeaders.push(req.headers["proxy-authorization"]);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ appId: "1", name: "app" }));
    });
    await new Promise<void>((resolve) =>
      proxyServer.listen(0, "127.0.0.1", resolve),
    );
    const proxyPort = (proxyServer.address() as AddressInfo).port;

    const unreachableTargetPort = await new Promise<number>((resolve) => {
      const probe = http.createServer();
      probe.listen(0, "localhost", () => {
        const { port } = probe.address() as AddressInfo;
        probe.close(() => resolve(port));
      });
    });

    try {
      const client = new KintoneRestAPIClient({
        baseUrl: `http://localhost:${unreachableTargetPort}`,
        auth: { apiToken: "dummy-token" },
        proxy: {
          host: "127.0.0.1",
          port: proxyPort,
          protocol: "http",
          auth: { username: "", password: "" },
        },
      });

      const result = await client.app.getApp({ id: 1 });

      expect(result).toStrictEqual({ appId: "1", name: "app" });
      expect(proxyAuthHeaders).toStrictEqual([undefined]);
    } finally {
      proxyServer.close();
    }
  });

  // Regression test: `buildProxyUrl` encodes `proxy.auth` as URI userinfo
  // (`http://user:pass@host:port`) and hands that whole URI to undici's
  // `ProxyAgent({ uri })`. This confirms undici actually derives a
  // Proxy-Authorization header from that userinfo, rather than silently
  // dropping it (it has a separate `token` option for this, which
  // `buildProxyDispatcher` does not use) -- since `HTTPS_PROXY`-style values
  // with embedded credentials are a common real-world shape.
  it("sends Proxy-Authorization (Basic) when proxy.auth has real credentials", async () => {
    const proxyAuthHeaders: Array<string | undefined> = [];
    const proxyServer = http.createServer((req, res) => {
      proxyAuthHeaders.push(req.headers["proxy-authorization"]);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ appId: "1", name: "app" }));
    });
    await new Promise<void>((resolve) =>
      proxyServer.listen(0, "127.0.0.1", resolve),
    );
    const proxyPort = (proxyServer.address() as AddressInfo).port;

    const unreachableTargetPort = await new Promise<number>((resolve) => {
      const probe = http.createServer();
      probe.listen(0, "localhost", () => {
        const { port } = probe.address() as AddressInfo;
        probe.close(() => resolve(port));
      });
    });

    try {
      const client = new KintoneRestAPIClient({
        baseUrl: `http://localhost:${unreachableTargetPort}`,
        auth: { apiToken: "dummy-token" },
        proxy: {
          host: "127.0.0.1",
          port: proxyPort,
          protocol: "http",
          auth: { username: "admin", password: "s3cret" },
        },
      });

      const result = await client.app.getApp({ id: 1 });

      expect(result).toStrictEqual({ appId: "1", name: "app" });
      expect(proxyAuthHeaders).toStrictEqual([
        `Basic ${Buffer.from("admin:s3cret").toString("base64")}`,
      ]);
    } finally {
      proxyServer.close();
    }
  });

  // Verifies the migration path recommended in the README for consumers that
  // used to combine `httpsAgent` + a proxy-tunneling agent (e.g.
  // `https-proxy-agent`) to get "client cert auth over a CONNECT proxy" --
  // a pattern used by both @kintone/mcp-server's `buildHttpsAgent` and
  // cli-kintone's `buildRestAPIClient` (see kintone/project-items#696). That
  // combined Agent no longer works after the fetch migration (its custom
  // `connect` logic is never invoked), but `proxy` + `clientCertAuth`
  // together should reproduce the same behavior: `buildProxyDispatcher`
  // passes `clientCertAuth`'s PFX/passphrase as `ProxyAgent`'s `requestTls`,
  // which undici applies to the *tunneled* origin TLS handshake (not the
  // proxy connection itself).
  it("presents the client certificate to the origin when proxy and clientCertAuth are combined", async () => {
    const connectRequests: string[] = [];

    // A real CONNECT-capable forward proxy: on `CONNECT host:port`, it opens
    // a raw TCP socket to that host:port and pipes bytes both ways -- the
    // tunnel undici's ProxyAgent expects when proxying an https:// origin.
    const proxyServer = http.createServer();
    proxyServer.on("connect", (req, clientSocket, head) => {
      connectRequests.push(req.url ?? "");
      const [host, portStr] = (req.url ?? "").split(":");
      const targetSocket = net.connect(Number(portStr), host, () => {
        clientSocket.write("HTTP/1.1 200 Connection Established\r\n\r\n");
        targetSocket.write(head);
        targetSocket.pipe(clientSocket);
        clientSocket.pipe(targetSocket);
      });
      targetSocket.on("error", () => clientSocket.destroy());
    });
    await new Promise<void>((resolve) =>
      proxyServer.listen(0, "127.0.0.1", resolve),
    );
    const proxyPort = (proxyServer.address() as AddressInfo).port;

    // Same mTLS origin setup as ClientCertAuth.test.ts: requires and verifies
    // a client certificate, reached this time only through the proxy above.
    let socketAuthorized: boolean | undefined;
    let peerCommonName: string | undefined;
    const originServer = https.createServer(
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
        res.end(JSON.stringify({ appId: "1", name: "app" }));
      },
    );
    await new Promise<void>((resolve) =>
      originServer.listen(0, "127.0.0.1", resolve),
    );
    const originPort = (originServer.address() as AddressInfo).port;

    // Needed for the client to trust the origin's own self-signed cert (this
    // is orthogonal to what's under test -- it only affects whether the
    // client trusts the server, not whether the server verifies the client).
    const originalRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {
      const client = new KintoneRestAPIClient({
        baseUrl: `https://127.0.0.1:${originPort}`,
        auth: { apiToken: "dummy-token" },
        proxy: { host: "127.0.0.1", port: proxyPort, protocol: "http" },
        clientCertAuth: {
          pfx: fs.readFileSync(PFX_PATH),
          password: CORRECT_PASSPHRASE,
        },
      });

      const result = await client.app.getApp({ id: 1 });

      expect(result).toStrictEqual({ appId: "1", name: "app" });
      // Proves the CONNECT tunnel to the proxy was actually used...
      expect(connectRequests).toStrictEqual([`127.0.0.1:${originPort}`]);
      // ...and that the client certificate reached the origin through it.
      expect(socketAuthorized).toBe(true);
      expect(peerCommonName).toBe("kintone-js-sdk-test-client");
    } finally {
      // eslint-disable-next-line require-atomic-updates
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalRejectUnauthorized;
      proxyServer.close();
      originServer.close();
    }
  });
});
