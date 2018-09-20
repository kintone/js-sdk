import assert from "assert";
import { CustomizeManifest, Option, Status, upload } from "../src/index";
import MockKintoneApiClient from "./MockKintoneApiClient";

describe("index", () => {
  describe("upload", () => {
    let kintoneApiClient: MockKintoneApiClient;
    let manifest: CustomizeManifest;
    let status: Status;
    let options: Option;
    beforeEach(() => {
      kintoneApiClient = new MockKintoneApiClient(
        "kintone",
        "hogehoge",
        "example.com",
        {
          proxy: "",
          guestSpaceId: 0
        }
      );
      manifest = {
        app: "1",
        scope: "ALL",
        desktop: {
          js: [
            "test/fixtures/a.js",
            "test/fixtures/b.js",
            "https://js.cybozu.com/jquery/3.3.1/jquery.min.js"
          ],
          css: ["test/fixtures/a.css"]
        },
        mobile: {
          js: ["test/fixtures/c.js"]
        }
      };
      status = {
        retryCount: 0,
        updateBody: null,
        updated: false
      };
      options = {
        lang: "en",
        proxy: "",
        guestSpaceId: 0
      };
    });
    it("shoule succeed the uploading", async () => {
      try {
        await upload(kintoneApiClient, manifest, status, options);
        assert.ok(true, "the upload has been successful");
      } catch (e) {
        assert.fail(e);
      }
    });
    it("should call kintone APIs by the right order", async () => {
      await upload(kintoneApiClient, manifest, status, options);
      assert.deepStrictEqual(
        kintoneApiClient.logs.map(({ method, path }) => ({
          method,
          path
        })),
        [
          { method: "POST", path: "/k/v1/file.json" },
          { method: "POST", path: "/k/v1/file.json" },
          { method: "POST", path: "/k/v1/file.json" },
          { method: "POST", path: "/k/v1/file.json" },
          { method: "PUT", path: "/k/v1/preview/app/customize.json" },
          { method: "POST", path: "/k/v1/preview/app/deploy.json" },
          { method: "GET", path: "/k/v1/preview/app/deploy.json" }
        ]
      );
    });
  });
});
