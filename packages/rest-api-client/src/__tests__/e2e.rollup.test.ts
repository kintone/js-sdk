import assert from "assert";
import type {
  OutputOptions,
  InputOptions,
  RollupBuild,
  RollupLog,
} from "rollup";
import { rollup } from "rollup";
import path from "path";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import fs from "fs";
import os from "os";
import { rimrafSync } from "rimraf";

const tempDir = fs.mkdtempSync(
  path.join(os.tmpdir(), "kintone-rest-api-client-rollup-bundle-"),
);

const extensions = [".ts", ".js"];

const TESTCASE_TIMEOUT = 30000;

describe("Rollup Bundler tests", function () {
  let bundle: RollupBuild;
  const outputFile = path.resolve(tempDir, "dist", "bundle.js");
  it(
    `should be able to build with Rollup successfully`,
    async () => {
      const inputOptions: InputOptions = {
        input: path.resolve(__dirname, "fixtures/index.ts"),
        plugins: [
          babel({
            babelHelpers: "bundled",
            presets: [["@babel/preset-env"], "@babel/preset-typescript"],
            extensions,
            include: ["../**/*"],
          }),
          resolve({ browser: true, preferBuiltins: false }),
          commonjs({ extensions }),
          json(),
        ],
        onwarn: (warning: RollupLog) => {
          assert.fail(warning.message);
        },
      };
      const outputOptions: OutputOptions = {
        extend: true,
        file: outputFile,
        format: "umd",
        name: "MyBundle",
      };
      try {
        bundle = await rollup(inputOptions);
        await bundle.write(outputOptions);
        assert.ok(fs.existsSync(outputFile));
      } catch (error: any) {
        assert.fail(error);
      }
    },
    TESTCASE_TIMEOUT,
  );

  afterAll(async () => {
    if (bundle) {
      await bundle.close();
    }
    rimrafSync(tempDir);
  });
});
