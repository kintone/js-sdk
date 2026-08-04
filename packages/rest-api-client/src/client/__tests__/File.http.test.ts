import { injectPlatformDeps } from "../../platform";
import * as browserDeps from "../../platform/browser";
import * as nodeDeps from "../../platform/node";
import type { HttpTestServer } from "./fixtures/HttpTestServer";
import type { FileClient } from "../FileClient";
import {
  API_TOKEN,
  expectRequest,
  makeHttpClients,
} from "./fixtures/FileClientHttpFixture";

describe("FileClient (HTTP level)", () => {
  let httpServer: HttpTestServer;
  let fileClient: FileClient;

  beforeEach(() => {
    const clients = makeHttpClients();
    fileClient = clients.fileClient;
    httpServer = clients.httpServer;
  });

  afterEach(() => {
    httpServer.close();
  });

  describe("uploadFile", () => {
    describe("with name & data", () => {
      const params = {
        file: {
          name: "text.text",
          data: "Hello!",
        },
      };
      beforeEach(async () => {
        httpServer.mockResponse({ fileKey: "some_file_key" });
        await fileClient.uploadFile(params);
      });
      // uploadFile sends a real multipart/form-data body, so this can't reuse
      // expectRequest as-is: the boundary in Content-Type and the resulting
      // Content-Length are inherently non-deterministic (random boundary,
      // encoding overhead), unlike the fixed JSON bodies expectRequest expects.
      it("should send the file as a multipart part over the wire", () => {
        const log = httpServer.getLogs()[0];
        expect(log.method).toBe("post");
        expect(log.path).toBe("/k/v1/file.json");
        expect(log.body).toStrictEqual({
          file: {
            kind: "file",
            filename: params.file.name,
            content: params.file.data,
          },
        });
      });
      it("should send a multipart/form-data content-type with a boundary", () => {
        expect(httpServer.getLogs()[0].headers["content-type"]).toMatch(
          /^multipart\/form-data; boundary=.+/,
        );
      });
      it("should send the api token header", () => {
        expect(httpServer.getLogs()[0].headers["x-cybozu-api-token"]).toBe(
          API_TOKEN,
        );
      });
      it("should return the parsed response body from the server", async () => {
        httpServer.reset();
        httpServer.mockResponse({ fileKey: "some_file_key" });
        await expect(fileClient.uploadFile(params)).resolves.toStrictEqual({
          fileKey: "some_file_key",
        });
      });
    });

    describe("with file path", () => {
      const params = {
        file: {
          path: "foo/bar/baz.txt",
        },
      };
      beforeEach(() => {
        injectPlatformDeps({
          ...nodeDeps,
          readFileFromPath: async (filePath: string) => ({
            name: filePath,
            data: "Hello!",
          }),
        });
      });
      it("should read the file from disk and send it as a multipart part over the wire", async () => {
        httpServer.mockResponse({ fileKey: "some_file_key" });
        await fileClient.uploadFile(params);
        // form-data normalizes a filename containing path separators down to
        // its basename when building the multipart part.
        expect(httpServer.getLogs()[0].body).toStrictEqual({
          file: {
            kind: "file",
            filename: "baz.txt",
            content: "Hello!",
          },
        });
      });
    });

    describe("on a browser environment", () => {
      const params = {
        file: {
          path: "foo/bar/baz.txt",
        },
      };
      it("should raise an error on a browser environment", async () => {
        injectPlatformDeps(browserDeps);
        await expect(fileClient.uploadFile(params)).rejects.toThrow(
          "uploadFile doesn't allow to accept a file path in Browser environment.",
        );
      });
    });
  });

  describe("downloadFile", () => {
    const params = { fileKey: "some_file_key" };
    const fileContent = Buffer.from("this is the file content");
    beforeEach(() => {
      httpServer.mockBinaryResponse(fileContent);
    });
    it("should send the exact request over the wire", async () => {
      await fileClient.downloadFile(params);
      expectRequest(httpServer, 0, {
        method: "get",
        path: "/k/v1/file.json",
        query: params,
      });
    });
    it("should return the exact binary response body from the server", async () => {
      const result = await fileClient.downloadFile(params);
      expect(Buffer.from(result)).toStrictEqual(fileContent);
    });
  });
});

describe("FileClient with guestSpaceId (HTTP level)", () => {
  it("should send the guest space path over the wire", async () => {
    const GUEST_SPACE_ID = 1;
    const params = {
      file: {
        name: "text.text",
        data: "Hello!",
      },
    };
    const clients = makeHttpClients(GUEST_SPACE_ID);
    try {
      clients.httpServer.mockResponse({ fileKey: "some_file_key" });
      await clients.fileClient.uploadFile(params);
      const log = clients.httpServer.getLogs()[0];
      expect(log.method).toBe("post");
      expect(log.path).toBe(`/k/guest/${GUEST_SPACE_ID}/v1/file.json`);
    } finally {
      clients.httpServer.close();
    }
  });
});
