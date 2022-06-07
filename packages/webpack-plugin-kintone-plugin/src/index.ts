import fs from "fs";
import mkdirp from "mkdirp";
import path from "path";
import { Compiler, WebpackPluginInstance } from "webpack";

import { generatePlugin, getAssetPaths } from "./plugin";

interface Option {
  manifestJSONPath: string;
  privateKeyPath: string;
  pluginZipPath: string | PluginZipPathFunction;
}

type PluginZipPathFunction = (
  id: string,
  manifest: { [key: string]: any }
) => string;

class KintonePlugin implements WebpackPluginInstance {
  private readonly options: Option;
  private readonly name: string;
  private privateKey: string | null;
  constructor(options: Partial<Option> = {}) {
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
    const { manifestJSONPath, privateKeyPath } = this.options;
    compiler.hooks.afterPlugins.tap(this.name, () => {
      if (!fs.existsSync(manifestJSONPath)) {
        throw new Error(`manifestJSONPath cannot found: ${manifestJSONPath}`);
      }
      if (!fs.existsSync(privateKeyPath)) {
        throw new Error(`privateKeyPath cannot found: ${privateKeyPath}`);
      }
      this.privateKey = fs.readFileSync(privateKeyPath, "utf-8");

      if (compiler.options.watch || compiler.watchMode) {
        compiler.hooks.afterCompile.tap(this.name, (compilation) => {
          // Watch assets specified in manifest.json
          // https://webpack.js.org/contribute/plugin-patterns/#monitoring-the-watch-graph
          const allAssetPaths = getAssetPaths(this.options.manifestJSONPath);
          const chunkPaths = [...compilation.chunks]
            .reduce<string[]>(
              (paths, chunk) => paths.concat([...chunk.files]),
              []
            )
            .map((chunkFile) => path.resolve(compiler.outputPath, chunkFile));
          // exclude output chunks because afterEmit is triggered twice when js source file changed.
          const assetPaths = allAssetPaths.filter(
            (assetPath) => !chunkPaths.includes(assetPath)
          );
          compilation.fileDependencies.addAll(assetPaths);
        });
      }

      compiler.hooks.afterEmit.tapPromise(this.name, () =>
        this.generatePlugin()
      );
    });
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

export default KintonePlugin;
module.exports = KintonePlugin;
module.exports.default = module.exports;
