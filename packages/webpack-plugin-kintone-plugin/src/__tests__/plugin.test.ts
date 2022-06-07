import path from "path";
import { getAssetPaths } from "../plugin";

const SAMPLE_PLUGIN_PATH = path.resolve(__dirname, "fixtures/sample/plugin");
const MANIFEST_JSON_FILE = path.resolve(SAMPLE_PLUGIN_PATH, "manifest.json");

describe("plugin", () => {
  describe("getAssetPaths", () => {
    it("should return asset file paths from the manifest.json", () => {
      expect(getAssetPaths(MANIFEST_JSON_FILE)).toStrictEqual([
        path.resolve(SAMPLE_PLUGIN_PATH, "js/desktop.js"),
        path.resolve(SAMPLE_PLUGIN_PATH, "css/desktop.css"),
        path.resolve(SAMPLE_PLUGIN_PATH, "js/mobile.js"),
        path.resolve(SAMPLE_PLUGIN_PATH, "css/mobile.css"),
        path.resolve(SAMPLE_PLUGIN_PATH, "js/config.js"),
        path.resolve(SAMPLE_PLUGIN_PATH, "css/config.css"),
        path.resolve(SAMPLE_PLUGIN_PATH, "html/config.html"),
        MANIFEST_JSON_FILE,
        path.resolve(SAMPLE_PLUGIN_PATH, "image/icon.png"),
      ]);
    });
  });
});
