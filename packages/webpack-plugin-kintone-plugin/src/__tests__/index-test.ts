import AdmZip from "adm-zip";
import { spawn, spawnSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import rimraf from "rimraf";

const pluginDir = path.resolve(__dirname, "sample");
const pluginZipPath = path.resolve(pluginDir, "dist", "plugin.zip");
const pluginJSPaths = [
  path.resolve(pluginDir, "plugin", "js", "desktop.js"),
  path.resolve(pluginDir, "plugin", "js", "mobile.js"),
  path.resolve(pluginDir, "plugin", "js", "config.js"),
];
const customNamePluginZipPath = path.resolve(
  pluginDir,
  "dist",
  "nfjiheanbocphdnoehhpddjmkhciokjb.sample.plugin.zip"
);
const notExistsDirPluginZipPath = path.resolve(
  pluginDir,
  "dist",
  "new",
  "to",
  "plugin.zip"
);
const notExistsDirWithCustomNamePluginZipPath = path.resolve(
  pluginDir,
  "dist",
  "new",
  "to",
  "nfjiheanbocphdnoehhpddjmkhciokjb.sample.plugin.zip"
);
const onWatchModePluginZipPath = path.resolve(
  pluginDir,
  "dist",
  "watch",
  "plugin.zip"
);

const runWebpack = (config = "webpack.config.js") => {
  const webpackCommand = `webpack${os.platform() === "win32" ? ".cmd" : ""}`;
  return spawnSync(
    webpackCommand,
    ["--config", config, "--mode", "production"],
    {
      cwd: pluginDir,
    }
  );
};

const runWebpackWatch = (config = "webpack.config.watch.js") => {
  const webpackCommand = `webpack${os.platform() === "win32" ? ".cmd" : ""}`;
  return spawn(
    webpackCommand,
    ["--config", config, "--mode", "development", "--watch"],
    {
      cwd: pluginDir,
      timeout: 5000,
    }
  );
};

const verifyPluginZip = (zipPath: string) => {
  expect(fs.existsSync(zipPath)).toBe(true);
  const zip = new AdmZip(zipPath);
  expect(
    zip.getEntries().map((entry: AdmZip.IZipEntry) => entry.entryName)
  ).toStrictEqual(["contents.zip", "PUBKEY", "SIGNATURE"]);
};

describe("KintonePlugin", () => {
  afterEach(() => {
    // Cleanup the zip
    [pluginZipPath, customNamePluginZipPath, ...pluginJSPaths].forEach(
      (generatedFilePath) => {
        try {
          fs.unlinkSync(generatedFilePath);
        } catch (e) {
          // noop
        }
      }
    );
    rimraf.sync(path.resolve(pluginDir, "dist", "new"));
  });
  it("should be able to create a plugin zip", () => {
    const rs = runWebpack();
    expect(rs.error).toBeUndefined();
    verifyPluginZip(pluginZipPath);
  });
  it("should be able to customize the zip name", () => {
    const rs = runWebpack("webpack.config.customize.name.js");
    expect(rs.error).toBeUndefined();
    verifyPluginZip(customNamePluginZipPath);
  });
  it("should be able to create the zip directory if it does not exist", () => {
    const rs = runWebpack("webpack.config.not.exists.dir.js");
    expect(rs.error).toBeUndefined();
    verifyPluginZip(notExistsDirPluginZipPath);
  });
  it("should be able to create the zip directory if it does not exist and using customize the zip name", () => {
    const rs = runWebpack(
      "webpack.config.not.exists.dir.with.customize.name.js"
    );
    expect(rs.error).toBeUndefined();
    verifyPluginZip(notExistsDirWithCustomNamePluginZipPath);
  });
  it("should be able to create a plugin zip when watch mode started (fix #1299)", (done) => {
    const rs = runWebpackWatch("webpack.config.watch.js");
    const onExit = (code: any) => {
      try {
        expect(code).toBe(0);
        done();
      } catch (e) {
        done(e);
      }
    };
    rs.on("close", onExit);

    rs.stdout.on("data", (data: string) => {
      try {
        if (data.includes("Success to create a plugin zip!")) {
          verifyPluginZip(onWatchModePluginZipPath);
          rs.removeListener("close", onExit);
          rs.kill();
          done();
        }
      } catch (e) {
        done(e);
      }
    });
  });
});
