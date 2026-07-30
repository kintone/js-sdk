import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import type { AddressInfo } from "node:net";
import { KintoneRestAPIClient } from "../../KintoneRestAPIClient";

/**
 * A real (non-mocked) HTTP server, not the msw-based HttpTestServer: this test
 * needs to observe exactly how many times the request actually hit the wire
 * and with what body on each hit, which msw's interception layer doesn't
 * expose the same way a real socket-level redirect round-trip does.
 */
class RedirectTestServer {
  public readonly requests: Array<{ method: string; body: Buffer }> = [];
  private readonly server: http.Server;
  public readonly baseUrl: Promise<string>;

  constructor(redirectStatus: number) {
    this.server = http.createServer((req, res) => {
      const chunks: Buffer[] = [];
      req.on("data", (chunk: Buffer) => chunks.push(chunk));
      req.on("end", () => {
        this.requests.push({
          method: req.method ?? "",
          body: Buffer.concat(chunks),
        });
        if (this.requests.length === 1) {
          res.writeHead(redirectStatus, { Location: "/k/v1/file.json" });
          res.end();
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ fileKey: "some_file_key" }));
      });
    });
    this.baseUrl = new Promise((resolve) => {
      this.server.listen(0, "localhost", () => {
        const { port } = this.server.address() as AddressInfo;
        resolve(`http://localhost:${port}`);
      });
    });
  }

  public close(): void {
    this.server.close();
  }
}

const FILE_CONTENT = "Hello!";

describe.each([307, 308])(
  "uploadFile follows a %d redirect",
  (redirectStatus) => {
    let server: RedirectTestServer;
    let tempFilePath: string;

    beforeAll(() => {
      // A real fs.createReadStream() - like docs/file.md documents as a valid
      // `file.data` - can only be drained once. If the redirect resend were
      // implemented by re-reading this same stream instance instead of the
      // bytes already buffered from its first (and only) read, the second
      // request would arrive with an empty body.
      tempFilePath = path.join(
        os.tmpdir(),
        `kintone-js-sdk-upload-redirect-${redirectStatus}.txt`,
      );
      fs.writeFileSync(tempFilePath, FILE_CONTENT);
    });

    afterAll(() => {
      fs.rmSync(tempFilePath, { force: true });
    });

    afterEach(() => {
      server.close();
    });

    it("resends the exact same method and multipart body to the redirect target", async () => {
      server = new RedirectTestServer(redirectStatus);
      const client = new KintoneRestAPIClient({
        baseUrl: await server.baseUrl,
        auth: { apiToken: "dummy-token" },
      });

      const result = await client.file.uploadFile({
        file: { name: "text.txt", data: fs.createReadStream(tempFilePath) },
      });

      expect(result).toStrictEqual({ fileKey: "some_file_key" });
      expect(server.requests).toHaveLength(2);
      const [initial, redirected] = server.requests;
      // 307/308 (unlike 301/302/303) must preserve the original method and body.
      expect(redirected.method).toBe(initial.method);
      expect(redirected.method).toBe("POST");
      expect(redirected.body.equals(initial.body)).toBe(true);
      expect(initial.body.toString("utf-8")).toContain(FILE_CONTENT);
    });
  },
);
