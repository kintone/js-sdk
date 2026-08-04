import http from "node:http";
import type { AddressInfo } from "node:net";
import { KintoneRestAPIClient } from "../KintoneRestAPIClient";

const SOCKET_TIMEOUT = 300;
// Generous relative to SOCKET_TIMEOUT so this stays reliable under CI load,
// but still tight enough to fail if socketTimeout were silently ignored (the
// server below never responds, so an ignored timeout would otherwise hang
// until vitest's own test timeout).
const MAX_ELAPSED = 2000;

describe("socketTimeout", () => {
  it("aborts a request to an unresponsive server within socketTimeout", async () => {
    // Accepts the connection but never writes a response, so any request
    // only ever completes if the client itself enforces the timeout.
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const server = http.createServer(() => {});
    await new Promise<void>((resolve) =>
      server.listen(0, "localhost", resolve),
    );
    const { port } = server.address() as AddressInfo;

    try {
      const client = new KintoneRestAPIClient({
        baseUrl: `http://localhost:${port}`,
        auth: { apiToken: "dummy-token" },
        socketTimeout: SOCKET_TIMEOUT,
      });

      const start = Date.now();
      await expect(client.app.getApp({ id: 1 })).rejects.toThrow();
      expect(Date.now() - start).toBeLessThan(MAX_ELAPSED);
    } finally {
      server.close();
    }
  });
});
