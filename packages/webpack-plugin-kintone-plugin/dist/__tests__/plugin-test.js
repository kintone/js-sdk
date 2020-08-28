"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var plugin_1 = require("../plugin");
var SAMPLE_PLUGIN_PATH = path_1.default.resolve(__dirname, "sample/plugin");
var MANIFEST_JSON_FILE = path_1.default.resolve(SAMPLE_PLUGIN_PATH, "manifest.json");
describe("plugin", function () {
    describe("getAssetPaths", function () {
        it("should return asset file paths from the manifest.json", function () {
            expect(plugin_1.getAssetPaths(MANIFEST_JSON_FILE)).toStrictEqual([
                path_1.default.resolve(SAMPLE_PLUGIN_PATH, "js/customize.js"),
                path_1.default.resolve(SAMPLE_PLUGIN_PATH, "css/desktop.css"),
                path_1.default.resolve(SAMPLE_PLUGIN_PATH, "js/customize.js"),
                path_1.default.resolve(SAMPLE_PLUGIN_PATH, "css/mobile.css"),
                MANIFEST_JSON_FILE,
                path_1.default.resolve(SAMPLE_PLUGIN_PATH, "image/icon.png"),
            ]);
        });
    });
});
