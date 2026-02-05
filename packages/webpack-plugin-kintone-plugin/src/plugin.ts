import crypto from "crypto";
import fs from "fs";
import path from "path";
import os from "os";

import { getPluginId, packPlugin } from "./cli-runner";

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

// Taken from https://github.com/kintone/plugin-packer/blob/main/src/sourcelist.js
const sourceList = (manifest: Manifest): string[] => {
  const sourceTypes = [
    ["desktop", "js"],
    ["desktop", "css"],
    ["mobile", "js"],
    ["mobile", "css"],
    ["config", "js"],
    ["config", "css"],
  ];
  const list = sourceTypes
    // @ts-ignore
    .map((t) => manifest[t[0]] && manifest[t[0]][t[1]])
    .filter((i: string[] | void) => !!i)
    .reduce((a: string[], b: string[]) => a.concat(b), [])
    .filter((file: string) => !/^https?:\/\//.test(file));
  if (manifest.config && manifest.config.html) {
    list.push(manifest.config.html);
  }
  list.push("manifest.json", manifest.icon);
  return list;
};

/**
 * Get asset file paths from the manifest.json
 * @param manifestJSONPath
 */
export const getAssetPaths = (manifestJSONPath: string): string[] => {
  const manifest = JSON.parse(fs.readFileSync(manifestJSONPath, "utf-8"));
  return sourceList(manifest).map((file: string) =>
    path.resolve(path.dirname(manifestJSONPath), file),
  );
};

/**
 * Generate a plugin zip
 * @param manifestJSONPath Path to manifest.json
 * @param privateKeyPath Path to private key file
 */
export const generatePlugin = async (
  manifestJSONPath: string,
  privateKeyPath: string,
): Promise<{ id: string; buffer: Buffer }> => {
  const tempOutputPath = path.join(
    os.tmpdir(),
    `kintone-plugin-${crypto.randomUUID()}.zip`,
  );

  try {
    await packPlugin(manifestJSONPath, privateKeyPath, tempOutputPath);
    const pluginId = await getPluginId(tempOutputPath);
    const buffer = await fs.promises.readFile(tempOutputPath);
    return { id: pluginId, buffer };
  } finally {
    if (fs.existsSync(tempOutputPath)) {
      fs.unlinkSync(tempOutputPath);
    }
  }
};
