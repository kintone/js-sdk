import fs from "fs";
import path from "path";
import assert from "assert";

export type PluginTemplate = "minimum" | "modern";

export const readPluginManifestJson = (
  pluginDir: string,
  template: PluginTemplate = "minimum",
) => {
  try {
    const manifestJsonPath = path.resolve(
      pluginDir,
      template === "modern" ? "plugin" : "src",
      "manifest.json",
    );

    const fileContent = fs.readFileSync(manifestJsonPath, "utf8");
    return JSON.parse(fileContent);
  } catch (e) {
    throw new Error(`Failed to read manifest.json\n${e}`);
  }
};

export const assertObjectIncludes = (
  actual: { [key: PropertyKey]: unknown },
  expected: { [key: PropertyKey]: unknown },
  message?: string | Error,
) => {
  for (const key in expected) {
    if (Object.prototype.hasOwnProperty.call(expected, key)) {
      assert.deepStrictEqual(actual[key], expected[key], message);
    }
  }
};
