// @ts-ignore
import * as fs from 'fs';
import { Compiler, Plugin } from 'webpack';

// FIXME: Use @teppeis/kintone-plugin-packe/from-manifest after the file is exported
const packFromManifest = require('@teppeis/kintone-plugin-packer/src/pack-plugin-from-manifest');

type PluginZipPathFunction = (id: string, manifest: object) => string;

interface Option {
  manifestJSONPath: string;
  privateKeyPath: string;
  pluginZipPath: string | PluginZipPathFunction;
}

interface PackedPlugin {
  id: string;
  plugin: Buffer;
}

class KintonePlugin implements Plugin {
  private options: Option;
  private name: string;
  private privateKey: string | null;
  constructor(options = {}) {
    this.name = 'KintonePlugin';
    this.privateKey = null;
    this.options = Object.assign(
      {
        manifestJSONPath: './plugin/manifest.json',
        privateKeyPath: './private.ppk',
        pluginZipPath: './dist/plugin.zip'
      },
      options
    );
  }
  public apply(compiler: Compiler) {
    const { manifestJSONPath, privateKeyPath, pluginZipPath } = this.options;
    compiler.hooks.afterPlugins.tap('KintonePlugin', () => {
      if (!fs.existsSync(manifestJSONPath)) {
        throw new Error(`manifestJSONPath cannot found: ${manifestJSONPath}`);
      }
      if (!fs.existsSync(privateKeyPath)) {
        throw new Error(`privateKeyPath cannot found: ${privateKeyPath}`);
      }
      this.privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
    });
    compiler.hooks.afterEmit.tapPromise(this.name, compilation =>
      packFromManifest(manifestJSONPath, this.privateKey).then(
        (output: PackedPlugin) => {
          fs.writeFileSync(
            typeof pluginZipPath === 'function'
              ? // You can customize the zip file name using the plugin id and manifest
                pluginZipPath(
                  output.id,
                  JSON.parse(fs.readFileSync(manifestJSONPath, 'utf-8'))
                )
              : pluginZipPath,
            output.plugin
          );
          console.log('Plugin ID:', output.id);
        }
      )
    );
  }
}

module.exports = KintonePlugin;
module.exports.default = module.exports;
