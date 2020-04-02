import * as assert from "assert";
import * as path from "path";
import * as plugin from "../src/plugin";

const SAMPLE_PLUGIN_PATH = path.resolve(__dirname, "fixtures/sample/plugin");
const MANIFEST_JSON_FILE = path.resolve(SAMPLE_PLUGIN_PATH, "manifest.json");

describe("plugin", () => {
  describe("getAssetPaths", () => {
    it("should return asset file paths from the manifest.json", () => {
      assert.deepStrictEqual(plugin.getAssetPaths(MANIFEST_JSON_FILE), [
        path.resolve(SAMPLE_PLUGIN_PATH, "js/customize.js"),
        path.resolve(SAMPLE_PLUGIN_PATH, "css/desktop.css"),
        path.resolve(SAMPLE_PLUGIN_PATH, "js/customize.js"),
        path.resolve(SAMPLE_PLUGIN_PATH, "css/mobile.css"),
        MANIFEST_JSON_FILE,
        path.resolve(SAMPLE_PLUGIN_PATH, "image/icon.png"),
      ]);
    });
  });
});
