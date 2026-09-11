import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { FileClient } from "../FileClient";
import { makeFetchHttpClient } from "./fixtures/HttpClientTestHarness";
import { RedirectTestServer } from "./fixtures/RedirectTestServer";

const FILE_CONTENT = "Hello!";

describe.each([307, 308])(
  "uploadFile follows a %d redirect (HTTP level)",
  (redirectStatus) => {
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

    // Uses a real node:http server (RedirectTestServer), not the msw-based
    // HttpTestServer the other HTTP-level tests share: msw's fetch interceptor
    // unconditionally rejects a 307/308 redirect whenever the request has a
    // body, regardless of whether the underlying source is a re-readable
    // Buffer (see RedirectTestServer's comment). Only a real server can show
    // undici's actual (correct) resend behavior for this case.
    it("resends the exact same method and multipart body to the redirect target", async () => {
      const httpServer = new RedirectTestServer();
      await httpServer.listen();
      const httpClient = makeFetchHttpClient(httpServer.baseUrl);
      const fileClient = new FileClient(httpClient);

      try {
        httpServer.mockRedirectResponse("/k/v1/file.json", redirectStatus);
        httpServer.mockResponse({ fileKey: "some_file_key" });

        const result = await fileClient.uploadFile({
          file: { name: "text.txt", data: fs.createReadStream(tempFilePath) },
        });

        expect(result).toStrictEqual({ fileKey: "some_file_key" });
        const logs = httpServer.getLogs();
        expect(logs).toHaveLength(2);
        const [initial, redirected] = logs;
        // 307/308 (unlike 301/302/303) must preserve the original method and body.
        expect(redirected.method).toBe(initial.method);
        expect(redirected.method).toBe("post");
        expect(initial.body.length).toBeGreaterThan(0);
        expect(redirected.body.equals(initial.body)).toBe(true);
        expect(initial.body.toString("utf-8")).toContain(FILE_CONTENT);
      } finally {
        httpServer.close();
      }
    });
  },
);
