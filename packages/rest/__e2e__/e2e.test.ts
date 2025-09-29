// Polyfill Web APIs for Node.js environment before any imports
/* eslint-disable n/no-unsupported-features/node-builtins */
// Import basic Blob from Node.js buffer module first
if (typeof globalThis.Blob === "undefined") {
  const { Blob } = require("buffer");
  globalThis.Blob = Blob;
}

// Define minimal File implementation to satisfy undici
if (typeof globalThis.File === "undefined") {
  globalThis.File = class File extends globalThis.Blob {
    constructor(fileBits, fileName, options = {}) {
      super(fileBits, options);
      this.name = fileName;
      this.lastModified = options.lastModified || Date.now();
    }
  };
}

// Import FormData from undici after File is defined
try {
  const { FormData } = require("undici");
  if (typeof globalThis.FormData === "undefined") {
    globalThis.FormData = FormData;
  }
} catch (error) {
  console.warn("Failed to import FormData from undici:", error);
}

import { describe, it, expect } from "vitest";

import { createClient } from "../src/index.js";

const client = createClient({
  baseUrl: "http://127.0.0.1:4010/",
  auth: {
    type: "password",
    username: "admin",
    password: "admin",
  },
});

describe("kintone/rest", () => {
  describe("REST API", () => {
    it("record.json", async () => {
      const { data } = await client.request("get", "/k/v1/record.json", {
        params: {
          query: {
            app: 91593,
            id: 1,
          },
        },
      });
      expect(data).toEqual({
        record: {
          property1: {
            type: "CATEGORY",
            value: "string",
          },
          property2: {
            type: "CATEGORY",
            value: "string",
          },
        },
      });
    });

    it("record.json with guest space", async () => {
      const { data } = await client.request(
        "get",
        "/k/guest/{guestSpaceId}/v1/record.json",
        {
          params: {
            query: { app: 91593, id: 1 },
            path: { guestSpaceId: 1 },
          },
        },
      );
      expect(data).toEqual({
        record: {
          property1: {
            type: "CATEGORY",
            value: "string",
          },
          property2: {
            type: "CATEGORY",
            value: "string",
          },
        },
      });
    });

    it("file.json", async () => {
      const formData = new FormData();
      formData.append("file", new Blob(["test data"]), "test.txt");

      const { data } = await client.request("post", "/k/v1/file.json", {
        body: {
          file: formData,
        },
      });
      expect(data).toEqual({ fileKey: "string" });
    });

    it("bulkRequest.json", async () => {
      const { data } = await client.request("post", "/k/v1/bulkRequest.json", {
        body: {
          requests: [
            {
              method: "POST",
              api: "/k/v1/record.json",
              payload: {
                app: 91593,
                record: {
                  文字列__複数行_: { value: "test" },
                },
              },
            },
          ],
        },
      });
      expect(data).toEqual({ results: [{ id: 0, revision: 0 }] });
    });
  });
});
