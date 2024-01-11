import assert from "assert";
// import type { BuildOptions } from "vite";
import { build } from "vite";
import path from "path";
import fs from "fs";
// import os from "os";
import { rimrafSync } from "rimraf";
import { tempDir } from "./fixtures/vite.config";

// const tempDir = fs.mkdtempSync(
//   path.join(os.tmpdir(), "kintone-rest-api-client-vite-bundle-"),
// );

const TESTCASE_TIMEOUT = 30000;

describe("Vite Bundler tests", function () {
  it(
    `should be able to build with Vite successfully`,
    async () => {
      // const buildConfig: BuildOptions = {
      //   lib: {
      //     entry: path.resolve(__dirname, "fixtures/index.ts"),
      //     fileName: "bundle",
      //     formats: ["umd"],
      //     name: "MyBundle",
      //   },
      //   outDir: path.resolve(tempDir, "dist"),
      // };

      try {
        await build({
          logLevel: "info",
          envFile: false,
          configFile: path.resolve(__dirname, "fixtures/vite.config.ts"),
          // configFile: false,
          // build: buildConfig,
        });
        assert.ok(
          fs.existsSync(path.resolve(tempDir, "dist", "bundle.vite.umd.js")),
        );
      } catch (error: any) {
        assert.fail(error);
      }
    },
    TESTCASE_TIMEOUT,
  );

  afterAll(async () => {
    rimrafSync(tempDir);
  });
});
