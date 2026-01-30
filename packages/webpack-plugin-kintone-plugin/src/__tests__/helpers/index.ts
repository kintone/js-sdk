import { expect } from "vitest";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

// Fixture paths
export const fixtureDir = path.resolve(__dirname, "..", "fixtures", "sample");
export const pluginDir = path.resolve(fixtureDir, "plugin");
export const manifestJSONPath = path.resolve(pluginDir, "manifest.json");
export const privateKeyPath = path.resolve(fixtureDir, "private.ppk");

// JS files referenced in manifest.json
export const pluginJsOutputPaths = [
  path.resolve(pluginDir, "js", "desktop.js"),
  path.resolve(pluginDir, "js", "mobile.js"),
  path.resolve(pluginDir, "js", "config.js"),
];

// Expected plugin ID generated from the fixture's private.ppk
export const expectedPluginId = "nfjiheanbocphdnoehhpddjmkhciokjb";

export const verifyPluginZip = (zipPath: string) => {
  expect(fs.existsSync(zipPath)).toBe(true);
  const zip = new AdmZip(zipPath);
  expect(
    zip.getEntries().map((entry: AdmZip.IZipEntry) => entry.entryName),
  ).toStrictEqual(["contents.zip", "PUBKEY", "SIGNATURE"]);
};

/**
 * Create dummy JS files required by manifest.json
 */
export const createDummyJsFiles = () => {
  const jsDir = path.resolve(pluginDir, "js");
  if (!fs.existsSync(jsDir)) {
    fs.mkdirSync(jsDir, { recursive: true });
  }
  for (const jsFile of pluginJsOutputPaths) {
    fs.writeFileSync(jsFile, "// dummy");
  }
};

/**
 * Remove JS files created by tests
 */
export const cleanupJsFiles = () => {
  for (const jsFile of pluginJsOutputPaths) {
    if (fs.existsSync(jsFile)) {
      fs.unlinkSync(jsFile);
    }
  }
};
