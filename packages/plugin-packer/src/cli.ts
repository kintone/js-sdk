import path from "path";
import fs from "fs";
import { promisify } from "util";
import os from "os";
import * as chokidar from "chokidar";
import mkdirp from "mkdirp";
import _debug from "debug";
import validate from "@kintone/plugin-manifest-validator";
import packer from ".";
import console from "./console";
import { generateErrorMessages } from "./gen-error-msg";
import { createContentsZip } from "./create-contents-zip";

const debug = _debug("cli");
const writeFile = promisify(fs.writeFile);

type Options = Partial<{
  ppk: string;
  out: string;
  watch: boolean;
  packerMock_: typeof packer;
}>;

const cli = (pluginDir: string, options_?: Options) => {
  const options = options_ || {};
  const packerLocal = options.packerMock_ ? options.packerMock_ : packer;

  return Promise.resolve()
    .then(() => {
      // 1. check if pluginDir is a directory
      if (!fs.statSync(pluginDir).isDirectory()) {
        throw new Error(`${pluginDir} should be a directory.`);
      }

      // 2. check pluginDir/manifest.json
      const manifestJsonPath = path.join(pluginDir, "manifest.json");
      if (!fs.statSync(manifestJsonPath).isFile()) {
        throw new Error("Manifest file $PLUGIN_DIR/manifest.json not found.");
      }

      // 3. validate manifest.json
      const manifest = loadJson(manifestJsonPath);
      throwIfInvalidManifest(manifest, pluginDir);

      let outputDir = path.dirname(path.resolve(pluginDir));
      let outputFile = path.join(outputDir, "plugin.zip");
      if (options.out) {
        outputFile = options.out;
        outputDir = path.dirname(path.resolve(outputFile));
      }
      debug(`outputDir : ${outputDir}`);
      debug(`outputFile : ${outputFile}`);

      // 4. generate new ppk if not specified
      const ppkFile = options.ppk;
      let privateKey: string;
      if (ppkFile) {
        debug(`loading an existing key: ${ppkFile}`);
        privateKey = fs.readFileSync(ppkFile, "utf8");
      }

      // 5. package plugin.zip
      return Promise.all([
        mkdirp(outputDir),
        createContentsZip(pluginDir, manifest).then((contentsZip) =>
          packerLocal(contentsZip, privateKey)
        ),
      ]).then((result) => {
        const output = result[1];
        const ppkFilePath = path.join(outputDir, `${output.id}.ppk`);
        if (!ppkFile) {
          fs.writeFileSync(ppkFilePath, output.privateKey, "utf8");
        }

        if (options.watch) {
          // change events are fired before chagned files are flushed on Windows,
          // which generate an invalid plugin zip.
          // in order to fix this, we use awaitWriteFinish option only on Windows.
          const watchOptions =
            os.platform() === "win32"
              ? {
                  awaitWriteFinish: {
                    stabilityThreshold: 1000,
                    pollInterval: 250,
                  },
                }
              : {};
          const watcher = chokidar.watch(pluginDir, watchOptions);
          watcher.on("change", () => {
            cli(
              pluginDir,
              Object.assign({}, options, {
                watch: false,
                ppk: options.ppk || ppkFilePath,
              })
            );
          });
        }
        return outputPlugin(outputFile, output.plugin);
      });
    })
    .then((outputFile) => {
      console.log("Succeeded:", outputFile);
      return outputFile;
    })
    .catch((error) => {
      console.error("Failed:", error.message);
      return Promise.reject(error);
    });
};

export = cli;

const throwIfInvalidManifest = (manifest: any, pluginDir: string) => {
  const result = validate(manifest, {
    relativePath: validateRelativePath(pluginDir),
    maxFileSize: validateMaxFileSize(pluginDir),
  });
  debug(result);

  if (!result.valid) {
    const msgs = generateErrorMessages(result.errors!);
    console.error("Invalid manifest.json:");
    msgs.forEach((msg) => {
      console.error(`- ${msg}`);
    });
    throw new Error("Invalid manifest.json");
  }
};

/**
 * Create and save plugin.zip
 */
const outputPlugin = (outputPath: string, plugin: Buffer): Promise<string> => {
  return writeFile(outputPath, plugin).then((arg) => outputPath);
};

/**
 * Load JSON file without caching
 */
const loadJson = (jsonPath: string) => {
  const content = fs.readFileSync(jsonPath, "utf8");
  return JSON.parse(content);
};

/**
 * Return validator for `relative-path` format
 */
const validateRelativePath = (pluginDir: string) => {
  return (str: string) => {
    try {
      const stat = fs.statSync(path.join(pluginDir, str));
      return stat.isFile();
    } catch (e) {
      return false;
    }
  };
};

/**
 * Return validator for `maxFileSize` keyword
 */
const validateMaxFileSize = (pluginDir: string) => {
  return (maxBytes: number, filePath: string) => {
    try {
      const stat = fs.statSync(path.join(pluginDir, filePath));
      return stat.size <= maxBytes;
    } catch (e) {
      return false;
    }
  };
};
