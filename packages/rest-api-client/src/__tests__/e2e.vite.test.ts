import assert from "assert";
import { build } from "vite";
import path from "path";
import fs from "fs";
import { rimrafSync } from "rimraf";
import { tempDir } from "./fixtures/vite.config";

const TESTCASE_TIMEOUT = 30000;

describe("Vite Bundler tests", function () {
  it(
    `should be able to build with Vite successfully`,
    async () => {
      try {
        await build({
          logLevel: "info",
          envFile: false,
          configFile: path.resolve(__dirname, "fixtures/vite.config.ts"),
        });
        assert.ok(
          fs.existsSync(path.resolve(tempDir, "dist", "bundle.vite.umd.js")),
        );
      } catch (error: any) {
        console.log(error);
        assert.fail(error);
      }
    },
    TESTCASE_TIMEOUT,
  );

  afterAll(async () => {
    rimrafSync(tempDir);
  });
});
