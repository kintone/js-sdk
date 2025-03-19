import { createClient } from "../src";

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
      const { data } = await client.api("/k/v1/record.json", "get", {
        app: 91593,
        id: 1,
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
      const { data } = await client.GET(
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
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      const formData = new FormData();
      formData.append("file", new Blob(["test data"]), "test.txt");

      const { data } = await client.POST("/k/v1/file.json", {
        body: {
          file: formData,
        },
        bodySerializer: (body) => {
          return body.file;
        },
      });
      expect(data).toEqual({ fileKey: "string" });
    });

    it("bulkRequest.json", async () => {
      const { data } = await client.POST("/k/v1/bulkRequest.json", {
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
