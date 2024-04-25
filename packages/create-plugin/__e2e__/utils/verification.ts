import fs from "fs";
import path from "path";
import assert from "assert";

export const readPluginManifestJson = (pluginDir: string) => {
  try {
    const fileContent = fs.readFileSync(
      path.resolve(pluginDir, "src", "manifest.json"),
      "utf8",
    );

    return JSON.parse(fileContent);
  } catch (e) {
    assert.fail(`Failed to read manifest.json\n${e}`);
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
