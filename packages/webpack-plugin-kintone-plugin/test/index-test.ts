import * as AdmZip from "adm-zip";
import * as assert from "assert";
import { spawnSync } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as webpack from "webpack";
// @ts-ignore
import * as webpackConfig from "./fixtures/sample/webpack.config";

const pluginDir = path.resolve(__dirname, "fixtures", "sample");
const pluginZipPath = path.resolve(pluginDir, "dist", "plugin.zip");
const pluginJSPath = path.resolve(pluginDir, "plugin", "js", "customize.js");
const customNamePluginZipPath = path.resolve(
  pluginDir,
  "dist",
  "nfjiheanbocphdnoehhpddjmkhciokjb.sample.plugin.zip"
);

const runWebpack = (config = "webpack.config.js") => {
  const webpackCommand = `webpack${os.platform() === "win32" ? ".cmd" : ""}`;
  return spawnSync(
    webpackCommand,
    ["--config", config, "--mode", "production"],
    {
      cwd: pluginDir
    }
  );
};

const verifyPluginZip = (zipPath: string) => {
  assert(fs.existsSync(zipPath));
  const zip = new AdmZip(zipPath);
  assert.deepStrictEqual(
    zip.getEntries().map((entry: AdmZip.IZipEntry) => entry.entryName),
    ["contents.zip", "PUBKEY", "SIGNATURE"]
  );
};

describe("KintonePlugin", () => {
  afterEach(() => {
    // Cleanup the zip
    [pluginZipPath, customNamePluginZipPath, pluginJSPath].forEach(
      generatedFilePath => {
        try {
          fs.unlinkSync(generatedFilePath);
        } catch (e) {
          // noop
        }
      }
    );
  });
  it("should be able to create a plugin zip", () => {
    const rs = runWebpack();
    assert(rs.error == null, rs.error && rs.error.message);
    verifyPluginZip(pluginZipPath);
  });
  it("should be able to customize the zip name", () => {
    const rs = runWebpack("webpack.config.customize.name.js");
    assert(rs.error == null, rs.error && rs.error.message);
    verifyPluginZip(customNamePluginZipPath);
  });
});
