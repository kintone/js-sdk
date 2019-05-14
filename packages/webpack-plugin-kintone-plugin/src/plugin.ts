import * as fs from "fs";
import * as path from "path";

const packFromManifest = require("@kintone/plugin-packer/from-manifest");

interface PackedPlugin {
  id: string;
  plugin: Buffer;
}

interface Manifest {
  desktop?: {
    js?: string[];
    css?: string[];
  };
  mobile?: {
    js?: string[];
    css?: string[];
  };
  config?: {
    html?: string;
    js?: string[];
    css?: string[];
  };
  icon: string;
}

// Taken from https://github.com/kintone/plugin-packer/blob/master/src/sourcelist.js
function sourceList(manifest: Manifest): string[] {
  const sourceTypes = [
    ["desktop", "js"],
    ["desktop", "css"],
    ["mobile", "js"],
    ["mobile", "css"],
    ["config", "js"],
    ["config", "css"]
  ];
  const list = sourceTypes
    // @ts-ignore
    .map(t => manifest[t[0]] && manifest[t[0]][t[1]])
    .filter((i: string[] | void) => !!i)
    .reduce((a: string[], b: string[]) => a.concat(b), [])
    .filter((file: string) => !/^https?:\/\//.test(file));
  if (manifest.config && manifest.config.html) {
    list.push(manifest.config.html);
  }
  list.push("manifest.json", manifest.icon);
  return list;
}

/**
 * Get asset file paths from the manifest.json
 * @param manifestJSONPath
 */
export function getAssetPaths(manifestJSONPath: string): string[] {
  const manifest = JSON.parse(fs.readFileSync(manifestJSONPath, "utf-8"));
  return sourceList(manifest).map((file: string) =>
    path.resolve(path.dirname(manifestJSONPath), file)
  );
}
/**
 * Generate a plugin zip
 * @param manifestJSONPath
 * @param pluginZipPath
 * @param privateKey
 */
export function generatePlugin(
  manifestJSONPath: string,
  privateKey: string | null
): Promise<{ id: string; buffer: Buffer }> {
  return packFromManifest(manifestJSONPath, privateKey).then(
    (output: PackedPlugin) => ({ id: output.id, buffer: output.plugin })
  );
}
