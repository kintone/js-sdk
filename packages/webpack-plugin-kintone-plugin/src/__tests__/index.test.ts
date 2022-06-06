import fs from "fs";
import os from "os";
import path from "path";
import rimraf from "rimraf";
import webpack from "webpack";
import { promisify } from "util";
import { verifyPluginZip } from "./helpers";
import merge from "webpack-merge";
import KintonePlugin from "../index";

const pluginDir = path.resolve(__dirname, "fixtures", "sample");
const pluginJsOutputPaths = [
  path.resolve(pluginDir, "plugin", "js", "desktop.js"),
  path.resolve(pluginDir, "plugin", "js", "mobile.js"),
  path.resolve(pluginDir, "plugin", "js", "config.js"),
];

const PLUGIN_ID = "nfjiheanbocphdnoehhpddjmkhciokjb";

const tempDir = fs.mkdtempSync(
  path.join(os.tmpdir(), "kintone-webpack-plugin-kintone-plugin-index-")
);

const webpackBaseConfig: webpack.Configuration = {
  mode: "production",
  entry: {
    desktop: path.resolve(pluginDir, "src", "desktop.js"),
    mobile: path.resolve(pluginDir, "src", "mobile.js"),
    config: path.resolve(pluginDir, "src", "config.js"),
  },
  output: {
    path: path.resolve(pluginDir, "plugin", "js"),
    filename: "[name].js",
  },
};

describe("KintonePlugin", () => {
  afterAll(() => {
    rimraf.sync(tempDir);
  });

  afterEach(() => {
    [...pluginJsOutputPaths].forEach((generatedFilePath) => {
      try {
        fs.unlinkSync(generatedFilePath);
      } catch (e) {
        // noop
      }
    });
  });

  it("should be able to create a plugin zip", async () => {
    const pluginZipPath = path.resolve(tempDir, "plugin.zip");
    const config = merge(webpackBaseConfig, {
      plugins: [
        new KintonePlugin({
          manifestJSONPath: path.resolve(pluginDir, "plugin", "manifest.json"),
          privateKeyPath: path.resolve(pluginDir, "private.ppk"),
          pluginZipPath,
        }),
      ],
    });
    const compiler = webpack(config);
    await promisify(compiler.run).bind(compiler)();
    verifyPluginZip(pluginZipPath);
    await promisify(compiler.close).bind(compiler)();
  });
  it("should be able to customize the zip name", async () => {
    const pluginZipPath = path.resolve(
      tempDir,
      `${PLUGIN_ID}.sample.plugin.zip`
    );
    const config = merge(webpackBaseConfig, {
      plugins: [
        new KintonePlugin({
          manifestJSONPath: path.resolve(pluginDir, "plugin", "manifest.json"),
          privateKeyPath: path.resolve(pluginDir, "private.ppk"),
          pluginZipPath: (id, manifest) =>
            path.resolve(
              tempDir,
              `${id}.${manifest.name.en.replace(/\s/g, ".")}.zip`
            ),
        }),
      ],
    });
    const compiler = webpack(config);
    await promisify(compiler.run).bind(compiler)();
    verifyPluginZip(pluginZipPath);
    await promisify(compiler.close).bind(compiler)();
  });
  it("should be able to create the zip directory if it does not exist", async () => {
    const pluginZipPath = path.resolve(tempDir, "nonExistDir", "plugin.zip");
    const config = merge(webpackBaseConfig, {
      plugins: [
        new KintonePlugin({
          manifestJSONPath: path.resolve(pluginDir, "plugin", "manifest.json"),
          privateKeyPath: path.resolve(pluginDir, "private.ppk"),
          pluginZipPath,
        }),
      ],
    });
    const compiler = webpack(config);
    await promisify(compiler.run).bind(compiler)();
    verifyPluginZip(pluginZipPath);
    await promisify(compiler.close).bind(compiler)();
  });
  it("should be able to create the zip directory if it does not exist and using customize the zip name", async () => {
    const pluginZipPath = path.resolve(
      tempDir,
      "nonExistDirWithCustomizeName",
      `${PLUGIN_ID}.sample.plugin.zip`
    );
    const config = merge(webpackBaseConfig, {
      plugins: [
        new KintonePlugin({
          manifestJSONPath: path.resolve(pluginDir, "plugin", "manifest.json"),
          privateKeyPath: path.resolve(pluginDir, "private.ppk"),
          pluginZipPath: (id, manifest) =>
            path.resolve(
              tempDir,
              "nonExistDirWithCustomizeName",
              `${id}.${manifest.name.en.replace(/\s/g, ".")}.zip`
            ),
        }),
      ],
    });
    const compiler = webpack(config);
    await promisify(compiler.run).bind(compiler)();
    verifyPluginZip(pluginZipPath);
    await promisify(compiler.close).bind(compiler)();
  });
});
