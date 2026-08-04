import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { makeHttpClients } from "./fixtures/FileClientHttpFixture";

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

    it("resends the exact same method and multipart body to the redirect target", async () => {
      const { fileClient, httpServer } = makeHttpClients();
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
        expect(redirected.body).toStrictEqual(initial.body);
        expect(initial.body).toStrictEqual({
          file: { kind: "file", filename: "text.txt", content: FILE_CONTENT },
        });
      } finally {
        httpServer.close();
      }
    });
  },
);
