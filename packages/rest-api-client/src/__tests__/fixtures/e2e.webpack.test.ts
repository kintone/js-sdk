import assert from "assert";
import type { Configuration } from "webpack";
import { webpack } from "webpack";
import path from "path";
import fs from "fs";
import os from "os";
import { rimrafSync } from "rimraf";
import { promisify } from "util";

const tempDir = fs.mkdtempSync(
  path.join(os.tmpdir(), "kintone-rest-api-client-webpack-bundle-")
);

describe("Webpack Bundler tests", () => {
  it(`should be able to build with Webpack successfully`, async () => {
    const config: Configuration = {
      mode: "production",
      entry: {
        index: path.resolve(__dirname, "./fixtures/index.ts"),
      },
      output: {
        filename: "bundle.js",
        path: path.resolve(tempDir, "dist"),
      },
      module: {
        rules: [
          {
            test: /\.[t|j]sx?$/,
            loader: "babel-loader",
            exclude: /node_modules/,
            options: {
              presets: [["@babel/preset-env"], "@babel/preset-typescript"],
            },
          },
        ],
      },
      resolve: {
        extensions: [".ts", ".js"],
      },
    };
    try {
      const compiler = webpack(config);
      await promisify(compiler.run).bind(compiler)();
      assert.ok(fs.existsSync(path.resolve(tempDir, "dist", "bundle.js")));
      await promisify(compiler.close).bind(compiler)();
    } catch (error: any) {
      assert.fail(error);
    }
  });

  afterAll(async () => {
    rimrafSync(tempDir);
  });
});
