import { spawnSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { verifyPluginZip, fixtureDir, cleanupJsFiles } from "./helpers";

const pluginZipPath = path.resolve(fixtureDir, "dist", "plugin.zip");

const runWebpack = (config = "webpack.config.js") => {
  const isWindows = os.platform() === "win32";
  // Use npx to ensure webpack-cli is found in PATH
  return spawnSync(
    isWindows ? "npx.cmd" : "npx",
    ["webpack", "--config", config, "--mode", "production"],
    {
      cwd: fixtureDir,
      shell: isWindows,
    },
  );
};

describe("KintonePlugin", () => {
  afterAll(() => {
    // Cleanup the zip
    try {
      fs.unlinkSync(pluginZipPath);
    } catch {
      // noop
    }
    cleanupJsFiles();
  });
  it("should be able to create a plugin zip", () => {
    const rs = runWebpack();
    expect(rs.error).toBeUndefined();
    verifyPluginZip(pluginZipPath);
  });
});
