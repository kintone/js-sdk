import { spawnSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { verifyPluginZip } from "./helpers";

const pluginDir = path.resolve(__dirname, "fixtures", "sample");
const pluginZipPath = path.resolve(pluginDir, "dist", "plugin.zip");
const pluginJsOutputPaths = [
  path.resolve(pluginDir, "plugin", "js", "desktop.js"),
  path.resolve(pluginDir, "plugin", "js", "mobile.js"),
  path.resolve(pluginDir, "plugin", "js", "config.js"),
];

const runWebpack = (config = "webpack.config.js") => {
  const webpackCommand = `webpack${os.platform() === "win32" ? ".cmd" : ""}`;
  return spawnSync(
    webpackCommand,
    ["--config", config, "--mode", "production"],
    {
      cwd: pluginDir,
    },
  );
};

describe("KintonePlugin", () => {
  afterAll(() => {
    // Cleanup the zip
    [pluginZipPath, ...pluginJsOutputPaths].forEach((generatedFilePath) => {
      try {
        fs.unlinkSync(generatedFilePath);
      } catch (e) {
        // noop
      }
    });
  });
  it("should be able to create a plugin zip", () => {
    const rs = runWebpack();
    expect(rs.error).toBeUndefined();
    verifyPluginZip(pluginZipPath);
  });
});
