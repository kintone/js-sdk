import fs from "fs";
import os from "os";
import path from "path";
import { rimrafSync } from "rimraf";
import webpack from "webpack";
import { promisify } from "util";
import merge from "webpack-merge";
import KintonePlugin from "../index";
import {
  verifyPluginZip,
  fixtureDir,
  pluginDir,
  manifestJSONPath,
  privateKeyPath,
  expectedPluginId,
  cleanupJsFiles,
} from "./helpers";

const tempDir = fs.mkdtempSync(
  path.join(os.tmpdir(), "kintone-webpack-plugin-kintone-plugin-index-"),
);

const webpackBaseConfig: webpack.Configuration = {
  mode: "production",
  entry: {
    desktop: path.resolve(fixtureDir, "src", "desktop.js"),
    mobile: path.resolve(fixtureDir, "src", "mobile.js"),
    config: path.resolve(fixtureDir, "src", "config.js"),
  },
  output: {
    path: path.resolve(pluginDir, "js"),
    filename: "[name].js",
  },
};

describe("KintonePlugin", () => {
  afterAll(() => {
    rimrafSync(tempDir);
  });

  afterEach(() => {
    cleanupJsFiles();
  });

  it("should be able to create a plugin zip", async () => {
    const pluginZipPath = path.resolve(tempDir, "plugin.zip");
    const config = merge(webpackBaseConfig, {
      plugins: [
        new KintonePlugin({
          manifestJSONPath,
          privateKeyPath,
          pluginZipPath,
        }),
      ],
    });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const compiler = webpack(config)!;
    await promisify(compiler.run).bind(compiler)();
    verifyPluginZip(pluginZipPath);
    await promisify(compiler.close).bind(compiler)();
  });
  it("should be able to customize the zip name", async () => {
    const pluginZipPath = path.resolve(
      tempDir,
      `${expectedPluginId}.sample.plugin.zip`,
    );
    const config = merge(webpackBaseConfig, {
      plugins: [
        new KintonePlugin({
          manifestJSONPath,
          privateKeyPath,
          pluginZipPath: (id, manifest) =>
            path.resolve(
              tempDir,
              `${id}.${manifest.name.en.replace(/\s/g, ".")}.zip`,
            ),
        }),
      ],
    });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const compiler = webpack(config)!;
    await promisify(compiler.run).bind(compiler)();
    verifyPluginZip(pluginZipPath);
    await promisify(compiler.close).bind(compiler)();
  });
  it("should be able to create the zip directory if it does not exist", async () => {
    const pluginZipPath = path.resolve(tempDir, "nonExistDir", "plugin.zip");
    const config = merge(webpackBaseConfig, {
      plugins: [
        new KintonePlugin({
          manifestJSONPath,
          privateKeyPath,
          pluginZipPath,
        }),
      ],
    });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const compiler = webpack(config)!;
    await promisify(compiler.run).bind(compiler)();
    verifyPluginZip(pluginZipPath);
    await promisify(compiler.close).bind(compiler)();
  });
  it("should be able to create the zip directory if it does not exist and using customize the zip name", async () => {
    const pluginZipPath = path.resolve(
      tempDir,
      "nonExistDirWithCustomizeName",
      `${expectedPluginId}.sample.plugin.zip`,
    );
    const config = merge(webpackBaseConfig, {
      plugins: [
        new KintonePlugin({
          manifestJSONPath,
          privateKeyPath,
          pluginZipPath: (id, manifest) =>
            path.resolve(
              tempDir,
              "nonExistDirWithCustomizeName",
              `${id}.${manifest.name.en.replace(/\s/g, ".")}.zip`,
            ),
        }),
      ],
    });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const compiler = webpack(config)!;
    await promisify(compiler.run).bind(compiler)();
    verifyPluginZip(pluginZipPath);
    await promisify(compiler.close).bind(compiler)();
  });
});
