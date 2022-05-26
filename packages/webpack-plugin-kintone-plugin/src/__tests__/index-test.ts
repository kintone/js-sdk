import AdmZip from "adm-zip";
import { spawn, spawnSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import rimraf from "rimraf";
import { Readable } from "stream";

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

const runWebpackWatch = (options: { config?: string; srcDir?: string }) => {
  const config = options.config ?? "webpack.config.watch.js";
  const srcDir = options.srcDir ?? path.resolve(pluginDir, "src");
  const webpackCommand = `webpack${os.platform() === "win32" ? ".cmd" : ""}`;
  return spawn(
    webpackCommand,
    ["--config", config, "--mode", "development", "--watch"],
    {
      cwd: pluginDir,
      timeout: 10000,
      env: { ...process.env, SRC_DIR: srcDir },
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
    const rs = runWebpackWatch({});
    const onClose = (code: any) => {
      try {
        expect(code).toBe(0);
        done();
      } catch (e) {
        done(e);
      }
    };

    const onStdoutData = (data: Readable) => {
      try {
        if (data.toString().includes("Success to create a plugin zip!")) {
          verifyPluginZip(onWatchModePluginZipPath);
          rs.stdout.removeListener("data", onStdoutData);
          rs.removeListener("close", onClose);
          rs.kill();
          done();
        }
      } catch (e) {
        done(e);
      }
    };

    rs.once("close", onClose);
    rs.stdout.on("data", onStdoutData);
  });
  it("should not create plugin zip more than once for single webpack compilation when watch mode", (done) => {
    // copy src files to temp directory
    const tempDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "kintone-webpack-plugin-kintone-plugin-")
    );
    fs.mkdirSync(path.join(tempDir, "src"), { recursive: true });
    ["desktop.js", "mobile.js", "config.js"].forEach((filename) => {
      fs.copyFileSync(
        path.resolve(pluginDir, "src", filename),
        path.resolve(tempDir, "src", filename)
      );
    });

    let countFileChanged = 0;
    let countPluginZipGenerated = 0;

    const rs = runWebpackWatch({
      srcDir: path.resolve(tempDir, "src"),
    });

    const onClose = (code: number) => {
      try {
        expect(code).toBe(0);
        done();
      } catch (e) {
        done(e);
      }
    };

    const onStdoutData = (data: Readable) => {
      try {
        console.log(`${data}`); // TODO: delete
        if (!data.toString().includes("Success to create a plugin zip!")) {
          return;
        }
        verifyPluginZip(onWatchModePluginZipPath);
        countPluginZipGenerated++;
        console.log(`countPluginZipGenerated: ${countPluginZipGenerated}`); // TODO: delete

        expect(countPluginZipGenerated).toBe(countFileChanged + 1);

        if (countFileChanged > 2) {
          console.log("terminate child process!!"); // TODO: delete
          rs.stdout.removeListener("data", onStdoutData);
          rs.removeListener("close", onClose);
          rs.kill();
          done();
          return;
        }

        console.log("create file change!!!"); // TODO: delete
        countFileChanged++;
        fs.writeFileSync(
          path.resolve(tempDir, "src", "desktop.js"),
          `const count = ${countFileChanged};`
        );
        console.log(`countFileChanged: ${countFileChanged}`); // TODO: delete
      } catch (e) {
        done(e);
      }
    };

    rs.once("close", onClose);
    rs.stdout.on("data", onStdoutData);
  });
});
