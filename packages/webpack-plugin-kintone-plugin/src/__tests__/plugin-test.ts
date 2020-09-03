import path from "path";
import { getAssetPaths } from "../plugin";

const SAMPLE_PLUGIN_PATH = path.resolve(__dirname, "sample/plugin");
const MANIFEST_JSON_FILE = path.resolve(SAMPLE_PLUGIN_PATH, "manifest.json");

describe("plugin", () => {
  describe("getAssetPaths", () => {
    it("should return asset file paths from the manifest.json", () => {
      expect(getAssetPaths(MANIFEST_JSON_FILE)).toStrictEqual([
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
