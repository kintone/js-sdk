import assert from "assert";
import * as fs from "fs";
import { sep } from "path";
import rimraf from "rimraf";
import {
  ImportCustomizeManifest,
  importCustomizeSetting,
  Option,
} from "../import";
import MockKintoneApiClient from "./MockKintoneApiClient";

describe("import", () => {
  const testDestDir = "testDestDir";
  const filesToTestContent = [
    `${testDestDir}/desktop/js/bootstrap.min.js`,
    `${testDestDir}/desktop/js/a.js`,
    `${testDestDir}/desktop/css/bootstrap.min.css`,
    `${testDestDir}/desktop/css/bootstrap-reboot.min.css`,
    `${testDestDir}/desktop/css/bootstrap-grid.min.css`,
    `${testDestDir}/mobile/js/bootstrap.js`,
    `${testDestDir}/mobile/js/b.js`,
  ];

  const uploadFileBody = `(function() { console.log("hello"); })();`;

  describe("runImport", () => {
    let kintoneApiClient: MockKintoneApiClient;
    let manifest: ImportCustomizeManifest;
    let status: { retryCount: number };
    let options: Option;
    beforeEach(() => {
      kintoneApiClient = new MockKintoneApiClient(
        "kintone",
        "hogehoge",
        "oauthToken",
        "basicAuthUser",
        "basicAuthPass",
        "example.com",
        {
          proxy: "",
          guestSpaceId: 0,
        }
      );
      manifest = {
        app: "1",
      };
      status = {
        retryCount: 0,
      };
      options = {
        lang: "en",
        proxy: "",
        guestSpaceId: 0,
        destDir: testDestDir,
      };
    });

    afterEach(() => {
      rimraf.sync(`${testDestDir}`);
    });

    const assertManifestContent = (buffer: Buffer) => {
      const appCustomize = {
        app: "1",
        scope: "ALL",
        desktop: {
          js: [
            "https://js.cybozu.com/vuejs/v2.5.17/vue.min.js",
            "https://js.cybozu.com/lodash/4.17.11/lodash.min.js",
            `${testDestDir}/desktop/js/bootstrap.min.js`,
            `${testDestDir}/desktop/js/a.js`,
          ],
          css: [
            `${testDestDir}/desktop/css/bootstrap.min.css`,
            `${testDestDir}/desktop/css/bootstrap-reboot.min.css`,
            `${testDestDir}/desktop/css/bootstrap-grid.min.css`,
          ],
        },
        mobile: {
          js: [
            "https://js.cybozu.com/jquery/3.3.1/jquery.min.js",
            "https://js.cybozu.com/jqueryui/1.12.1/jquery-ui.min.js",
            `${testDestDir}/mobile/js/bootstrap.js`,
            `${testDestDir}/mobile/js/b.js`,
          ],
          css: [
            `${testDestDir}/mobile/css/bootstrap.min.css`,
            `${testDestDir}/mobile/css/bootstrap-reboot.min.css`,
            `${testDestDir}/mobile/css/bootstrap-grid.min.css`,
          ],
        },
      };
      assert.deepStrictEqual(JSON.parse(buffer.toString()), appCustomize);
    };

    const assertDownloadFile = (path: string) => {
      assert.ok(fs.existsSync(path), `test ${path} is exists`);
      const content = fs.readFileSync(path);
      assert.strictEqual(uploadFileBody, content.toString());
    };

    const assertImportUseCaseApiRequest = (
      mockKintoneApiClient: MockKintoneApiClient
    ) => {
      const expected: any[] = [
        {
          body: {
            app: "1",
          },
          method: "GET",
          path: "/k/v1/app/customize.json",
        },
        {
          body: {
            fileKey: "20181116095653774F24C632AF46E69BDC8F5EF04C8E24014",
          },
          method: "GET",
          path: "/k/v1/file.json",
        },
        {
          body: {
            fileKey: "20181116095653FF8D40EE4B364FD89A2B3A382EDCB259286",
          },
          method: "GET",
          path: "/k/v1/file.json",
        },
        {
          body: {
            fileKey: "201811160956531AFF9246D7CB40938A91EAC14A0622C9250",
          },
          method: "GET",
          path: "/k/v1/file.json",
        },
        {
          body: {
            fileKey: "201811160956531DCC5DA8C6E0480C8F3BD8A92EEFF584123",
          },
          method: "GET",
          path: "/k/v1/file.json",
        },
        {
          body: {
            fileKey: "20181116095653A6A52415705D403A9B1AB36E1448B32E191",
          },
          method: "GET",
          path: "/k/v1/file.json",
        },
        {
          body: {
            fileKey: "20181116095653C06A1FE34CFD43D6B21BE7F55D3B6ECB031",
          },
          method: "GET",
          path: "/k/v1/file.json",
        },
        {
          body: {
            fileKey: "201811160956535E4F00740689488C9ABE7DCF3E794B34315",
          },
          method: "GET",
          path: "/k/v1/file.json",
        },
        {
          body: {
            fileKey: "201811160956531AFF9246D7CB40938A91EAC14A0622C9250",
          },
          method: "GET",
          path: "/k/v1/file.json",
        },
        {
          body: {
            fileKey: "201811160956531DCC5DA8C6E0480C8F3BD8A92EEFF584123",
          },
          method: "GET",
          path: "/k/v1/file.json",
        },
        {
          body: {
            fileKey: "20181116095653A6A52415705D403A9B1AB36E1448B32E191",
          },
          method: "GET",
          path: "/k/v1/file.json",
        },
      ];
      assert.deepStrictEqual(mockKintoneApiClient.logs, expected);
    };

    it("should success updating customize-manifest.json and downloading uploaded js/css files", () => {
      const getAppCustomizeResponse = JSON.parse(
        fs
          .readFileSync(
            "src/commands/__tests__/fixtures/get-appcustomize-response.json"
          )
          .toString()
      );

      kintoneApiClient.willBeReturn("/k/v1/file.json", "GET", uploadFileBody);
      kintoneApiClient.willBeReturn(
        "/k/v1/app/customize.json",
        "GET",
        getAppCustomizeResponse
      );

      const execCommand = importCustomizeSetting(
        kintoneApiClient,
        manifest,
        status,
        options
      );

      return execCommand.then(() => {
        assertImportUseCaseApiRequest(kintoneApiClient);
        const manifestFile = `${testDestDir}/customize-manifest.json`;
        assert.ok(fs.existsSync(manifestFile), `test ${manifestFile} exists`);
        const contents = fs.readFileSync(manifestFile);
        assertManifestContent(contents);
        filesToTestContent.map(assertDownloadFile);
      });
    });
  });
});
