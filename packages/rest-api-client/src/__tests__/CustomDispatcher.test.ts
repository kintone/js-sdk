import net from "node:net";
import http from "node:http";
import https from "node:https";
import type { AddressInfo } from "node:net";
import { Agent } from "undici";
import { KintoneRestAPIClient } from "../KintoneRestAPIClient";

describe("dispatcher", () => {
  it("uses the caller-supplied dispatcher's own connection logic instead of connecting directly", async () => {
    const targetRequests: string[] = [];
    // The real server the request must actually reach. Nothing about the
    // client's baseUrl points here -- only the custom dispatcher below knows
    // about it, mirroring how a SOCKS proxy Dispatcher would route traffic
    // to an address the request URL never mentions.
    const targetServer = http.createServer((req, res) => {
      targetRequests.push(req.url ?? "");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ appId: "1", name: "app" }));
    });
    await new Promise<void>((resolve) =>
      targetServer.listen(0, "127.0.0.1", resolve),
    );
    const targetPort = (targetServer.address() as AddressInfo).port;

    // Nothing listens here: the baseUrl target is only ever reachable via
    // the dispatcher's own connect logic below, so a successful response
    // proves the caller-supplied dispatcher was actually used to establish
    // the connection, not just accepted and ignored. Allocated (then
    // immediately freed) instead of hardcoded, to avoid clashing with
    // anything already bound on a fixed port.
    const unreachableTargetPort = await new Promise<number>((resolve) => {
      const probe = http.createServer();
      probe.listen(0, "localhost", () => {
        const { port } = probe.address() as AddressInfo;
        probe.close(() => resolve(port));
      });
    });

    // A minimal stand-in for a proxy-tunneling Dispatcher (e.g. a SOCKS
    // proxy agent): it ignores the request's nominal host/port entirely and
    // always connects to the real target server instead. This is the exact
    // capability lost when httpsAgent stopped having its own connection
    // logic invoked -- `dispatcher` restores it.
    const dispatcher = new Agent({
      connect: (_options, callback) => {
        const socket = net.connect({ host: "127.0.0.1", port: targetPort });
        socket.once("connect", () => callback(null, socket));
        socket.once("error", (err) => callback(err, null));
      },
    });

    try {
      const client = new KintoneRestAPIClient({
        baseUrl: `http://localhost:${unreachableTargetPort}`,
        auth: { apiToken: "dummy-token" },
        dispatcher,
      });

      const result = await client.app.getApp({ id: 1 });

      expect(result).toStrictEqual({ appId: "1", name: "app" });
      expect(targetRequests).toHaveLength(1);
    } finally {
      targetServer.close();
      await dispatcher.close();
    }
  });

  it("keeps socketTimeout working alongside a caller-supplied dispatcher", async () => {
    const targetServer = http.createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ appId: "1", name: "app" }));
    });
    await new Promise<void>((resolve) =>
      targetServer.listen(0, "127.0.0.1", resolve),
    );
    const targetPort = (targetServer.address() as AddressInfo).port;

    const unreachableTargetPort = await new Promise<number>((resolve) => {
      const probe = http.createServer();
      probe.listen(0, "localhost", () => {
        const { port } = probe.address() as AddressInfo;
        probe.close(() => resolve(port));
      });
    });

    const dispatcher = new Agent({
      connect: (_options, callback) => {
        const socket = net.connect({ host: "127.0.0.1", port: targetPort });
        socket.once("connect", () => callback(null, socket));
        socket.once("error", (err) => callback(err, null));
      },
    });

    try {
      const client = new KintoneRestAPIClient({
        baseUrl: `http://localhost:${unreachableTargetPort}`,
        auth: { apiToken: "dummy-token" },
        dispatcher,
        socketTimeout: 5000,
      });

      const result = await client.app.getApp({ id: 1 });

      expect(result).toStrictEqual({ appId: "1", name: "app" });
    } finally {
      targetServer.close();
      await dispatcher.close();
    }
  });

  it("throws when both `dispatcher` and `proxy`/`httpsAgent`/`clientCertAuth` are specified", () => {
    const dispatcher = new Agent();
    try {
      expect(
        () =>
          new KintoneRestAPIClient({
            baseUrl: "https://example.kintone.com",
            auth: { apiToken: "dummy-token" },
            dispatcher,
            proxy: { host: "localhost", port: 8000 },
          }),
      ).toThrow("Cannot specify proxy along with dispatcher.");

      expect(
        () =>
          new KintoneRestAPIClient({
            baseUrl: "https://example.kintone.com",
            auth: { apiToken: "dummy-token" },
            dispatcher,
            httpsAgent: new https.Agent(),
          }),
      ).toThrow("Cannot specify httpsAgent along with dispatcher.");

      expect(
        () =>
          new KintoneRestAPIClient({
            baseUrl: "https://example.kintone.com",
            auth: { apiToken: "dummy-token" },
            dispatcher,
            clientCertAuth: { pfx: Buffer.alloc(0), password: "password" },
          }),
      ).toThrow("Cannot specify clientCertAuth along with dispatcher.");
    } finally {
      dispatcher.close();
    }
  });
});
