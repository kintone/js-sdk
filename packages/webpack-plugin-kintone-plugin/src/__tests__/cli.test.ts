import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { verifyPluginZip, fixtureDir, cleanupJsFiles } from "./helpers";

const pluginZipPath = path.resolve(fixtureDir, "dist", "plugin.zip");

const runWebpack = (config = "webpack.config.js") => {
  const webpackBin = require.resolve("webpack-cli/bin/cli.js");
  return spawnSync(
    process.execPath,
    [webpackBin, "--config", config, "--mode", "production"],
    {
      cwd: fixtureDir,
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
