import * as fs from "fs";
import { debounce } from "lodash";
import * as mkdirp from "mkdirp";
import * as path from "path";
import { Compiler, Plugin } from "webpack";

import { generatePlugin, getAssetPaths } from "./plugin";

import { watchFiles } from "./watch";

interface Option {
  manifestJSONPath: string;
  privateKeyPath: string;
  pluginZipPath: string | PluginZipPathFunction;
}

interface PackedPlugin {
  id: string;
  plugin: Buffer;
}

type PluginZipPathFunction = (
  id: string,
  manifest: { [key: string]: any }
) => string;

class KintonePlugin implements Plugin {
  private options: Option;
  private name: string;
  private privateKey: string | null;
  constructor(options = {}) {
    this.name = "KintonePlugin";
    this.privateKey = null;
    this.options = Object.assign(
      {
        manifestJSONPath: "./plugin/manifest.json",
        privateKeyPath: "./private.ppk",
        pluginZipPath: "./dist/plugin.zip",
      },
      options
    );
  }
  public apply(compiler: Compiler) {
    const { manifestJSONPath, privateKeyPath, pluginZipPath } = this.options;
    compiler.hooks.afterPlugins.tap("KintonePlugin", () => {
      if (!fs.existsSync(manifestJSONPath)) {
        throw new Error(`manifestJSONPath cannot found: ${manifestJSONPath}`);
      }
      if (!fs.existsSync(privateKeyPath)) {
        throw new Error(`privateKeyPath cannot found: ${privateKeyPath}`);
      }
      this.privateKey = fs.readFileSync(privateKeyPath, "utf-8");
      if (compiler.options.watch) {
        this.watchAssets();
      } else {
        compiler.hooks.afterEmit.tapPromise(this.name, (compilation) =>
          this.generatePlugin()
        );
      }
    });
  }
  /**
   * Watch assets specified in manifest.json
   */
  private watchAssets(): void {
    let unwatch: () => void;
    const onFileChange = debounce((file: string) => {
      console.log(`${file} was changed`);
      this.generatePlugin().then(() => {
        // If manifest.json has been updated we should reevaluate the target files and rewatch them
        if (/manifest\.json$/.test(file)) {
          if (typeof unwatch === "function") {
            unwatch();
          }
          unwatch = watchFiles(
            getAssetPaths(this.options.manifestJSONPath),
            onFileChange
          );
        }
      });
    });
    unwatch = watchFiles(
      getAssetPaths(this.options.manifestJSONPath),
      onFileChange
    );
  }
  /**
   * Generate a plugin zip
   */
  private generatePlugin(): Promise<void> {
    const { manifestJSONPath, pluginZipPath } = this.options;
    return generatePlugin(manifestJSONPath, this.privateKey).then((result) => {
      const zipPath =
        // You can customize the zip file name using the plugin id and manifest
        typeof pluginZipPath === "function"
          ? pluginZipPath(
              result.id,
              JSON.parse(fs.readFileSync(manifestJSONPath, "utf-8"))
            )
          : pluginZipPath;
      const zipDir = path.dirname(zipPath);
      if (!fs.existsSync(zipDir)) {
        mkdirp.sync(zipDir);
      }
      fs.writeFileSync(zipPath, result.buffer);
      console.log("----------------------");
      console.log("Success to create a plugin zip!");
      console.log(`Plugin ID: ${result.id}`);
      console.log(`Path: ${zipPath}`);
      console.log("----------------------");
    });
  }
}

module.exports = KintonePlugin;
module.exports.default = module.exports;
