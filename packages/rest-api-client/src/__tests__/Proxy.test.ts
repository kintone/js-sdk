import http from "node:http";
import type { AddressInfo } from "node:net";
import { KintoneRestAPIClient } from "../KintoneRestAPIClient";

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
});
