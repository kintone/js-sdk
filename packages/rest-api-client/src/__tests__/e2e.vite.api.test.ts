import assert from "assert";
import type { BuildOptions } from "vite";
import { build } from "vite";
import path from "path";
import fs from "fs";
import os from "os";
import { rimrafSync } from "rimraf";

const tempDir = fs.mkdtempSync(
  path.join(os.tmpdir(), "kintone-rest-api-client-vite-bundle-"),
);

const TESTCASE_TIMEOUT = 30000;

describe("Vite API Bundler tests", function () {
  it(
    `should be able to build with Vite successfully`,
    () => {
      const buildConfig: BuildOptions = {
        lib: {
          entry: path.resolve(__dirname, "./fixtures/index.ts"),
          formats: ["umd"],
          name: "MyBundle",
          fileName: "bundle.vite",
        },
        outDir: path.resolve(tempDir, "dist"),
        emptyOutDir: true,
      };
      // Dev note: It's unstable when using async/await
      return build({
        envFile: false,
        configFile: false,
        build: buildConfig,
      })
        .then(() => {
          assert.ok(
            fs.existsSync(path.resolve(tempDir, "dist", "bundle.vite.umd.js")),
          );
        })
        .catch((error: any) => {
          assert.fail(error);
        });
    },
    TESTCASE_TIMEOUT,
  );

  afterAll(async () => {
    rimrafSync(tempDir);
  });
});
