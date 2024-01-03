import assert from "assert";
import type { Configuration } from "webpack";
import webpack from "webpack";
import path from "path";
import fs from "fs";
// import os from "os";
import { rimrafSync } from "rimraf";
import { promisify } from "util";

// const tempDir = fs.mkdtempSync(
//   path.join(os.tmpdir(), "kintone-rest-api-client-webpack-bundle-"),
// );

const outputPath = path.resolve(__dirname, "dist");
const TESTCASE_TIMEOUT = 20000;

describe("Webpack Bundler tests", () => {
  it(
    `should be able to build with Webpack successfully`,
    async () => {
      const config: Configuration = {
        mode: "production",
        entry: path.resolve(__dirname, "fixtures/index.ts"),
        output: {
          filename: "bundle.js",
          path: outputPath,
        },
        module: {
          rules: [{ test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" }],
        },
        resolve: {
          extensions: [".ts", ".tsx", ".js"],
        },
      };
      try {
        const compiler = webpack(config);
        await promisify(compiler.run)
          .bind(compiler)()
          .then((stats: webpack.Stats | undefined) => {
            if (!stats) {
              return;
            }

            const info = stats.toJson();
            if (info.errors && info.errors.length > 0) {
              assert.fail(info.errors[0].message);
            }

            if (info.warnings && info.warnings.length > 0) {
              assert.fail(info.warnings[0].message);
            }
          });
        assert.ok(fs.existsSync(path.resolve(outputPath, "bundle.js")));
        await promisify(compiler.close).bind(compiler)();
      } catch (error: any) {
        assert.fail(error);
      }
    },
    TESTCASE_TIMEOUT,
  );

  afterAll(async () => {
    rimrafSync(outputPath);
  });
});
