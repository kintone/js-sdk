import fs from "fs";
import os from "os";
import path from "path";
import rimraf from "rimraf";

import webpack from "webpack";
import { verifyPluginZip } from "./helpers";
import KintonePlugin from "../index";
import chokidar from "chokidar";

const watchOptions =
  os.platform() === "win32"
    ? {
        awaitWriteFinish: {
          stabilityThreshold: 1000,
          pollInterval: 250,
        },
      }
    : {};

const pluginDir = path.resolve(__dirname, "fixtures", "sample");
const pluginJSPaths = [
  path.resolve(pluginDir, "plugin", "js", "desktop.js"),
  path.resolve(pluginDir, "plugin", "js", "mobile.js"),
  path.resolve(pluginDir, "plugin", "js", "config.js"),
];

const tempDir = fs.mkdtempSync(
  path.join(os.tmpdir(), "kintone-webpack-plugin-kintone-plugin-watch-")
);
const pluginZipPath = path.resolve(tempDir, "watch", "plugin.zip");
fs.mkdirSync(path.dirname(pluginZipPath), { recursive: true });

const webpackConfig: webpack.Configuration = {
  mode: "development",
  entry: {
    desktop: path.resolve(tempDir, "src", "desktop.js"),
    mobile: path.resolve(tempDir, "src", "mobile.js"),
    config: path.resolve(tempDir, "src", "config.js"),
  },
  output: {
    path: path.resolve(pluginDir, "plugin", "js"),
    filename: "[name].js",
  },
  plugins: [
    new KintonePlugin({
      manifestJSONPath: path.resolve(pluginDir, "plugin", "manifest.json"),
      privateKeyPath: path.resolve(pluginDir, "private.ppk"),
      pluginZipPath,
    }),
  ],
};

describe("KintonePlugin", () => {
  let compiler: webpack.Compiler;

  beforeEach(() => {
    // copy src files to temp directory
    fs.mkdirSync(path.join(tempDir, "src"), { recursive: true });
    ["desktop.js", "mobile.js", "config.js"].forEach((filename) => {
      fs.copyFileSync(
        path.resolve(pluginDir, "src", filename),
        path.resolve(tempDir, "src", filename)
      );
    });
  });

  afterAll(() => {
    rimraf.sync(tempDir);
  });

  afterEach(() => {
    // delete generated js files and plugin.zip
    [pluginZipPath, ...pluginJSPaths].forEach((generatedFilePath) => {
      try {
        fs.unlinkSync(generatedFilePath);
      } catch (e) {
        // noop
      }
    });
  });

  it("should be able to create a plugin zip when watch mode started (fix #1299)", (done) => {
    const pluginZipWatcher = chokidar.watch(
      path.dirname(pluginZipPath),
      watchOptions
    );

    const callback = (filepath: string) => {
      watching.suspend();
      expect(filepath).toBe(pluginZipPath);
      verifyPluginZip(pluginZipPath);
      watching.close(() => pluginZipWatcher.close().finally(() => done()));
    };

    pluginZipWatcher
      .on("add", (filepath) => {
        try {
          callback(filepath);
        } catch (e) {
          done(e);
        }
      })
      .on("error", (err) => done(err));

    compiler = webpack(webpackConfig);
    const watching = compiler.watch({}, (err) => {
      if (err) {
        done(err);
      }
      // noop
    });
  });
  it("should not create plugin zip more than once for single webpack compilation when watch mode", (done) => {
    let countFileChanged = 0;
    let countPluginZipGenerated = 0;

    const pluginZipWatcher = chokidar.watch(
      path.dirname(pluginZipPath),
      watchOptions
    );

    const callback = (filepath: string) => {
      // watching.suspend();
      expect(filepath).toBe(pluginZipPath);

      verifyPluginZip(pluginZipPath);

      countPluginZipGenerated++;
      console.log(`countPluginZipGenerated: ${countPluginZipGenerated}`);

      expect(countPluginZipGenerated).toBe(countFileChanged + 1);

      if (countFileChanged > 2) {
        watching.close(() => pluginZipWatcher.close().finally(() => done()));
      }

      // watching.resume();
      console.log("make file change.");
      countFileChanged++;
      fs.writeFileSync(
        path.resolve(tempDir, "src", "desktop.js"),
        `const count = ${countFileChanged};`
      );
      console.log(`countFileChanged: ${countFileChanged}`);
    };

    pluginZipWatcher
      .on("add", (filepath) => {
        console.log(`File ${filepath} has been added`);
        try {
          callback(filepath);
        } catch (e) {
          done(e);
        }
      })
      .on("change", (filepath) => {
        console.log(`File ${filepath} has been changed`);
        try {
          callback(filepath);
        } catch (e) {
          done(e);
        }
      })
      .on("error", (err) => done(err))
      .on("ready", () =>
        console.log("Initial scan complete. Ready for changes")
      );

    compiler = webpack(webpackConfig);
    const watching = compiler.watch({}, (err) => {
      if (err) {
        done(err);
      }
      // noop
    });
  });
});
