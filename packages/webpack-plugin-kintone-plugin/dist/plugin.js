"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePlugin = exports.getAssetPaths = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var packFromManifest = require("@kintone/plugin-packer/from-manifest");
// Taken from https://github.com/kintone/plugin-packer/blob/master/src/sourcelist.js
function sourceList(manifest) {
    var sourceTypes = [
        ["desktop", "js"],
        ["desktop", "css"],
        ["mobile", "js"],
        ["mobile", "css"],
        ["config", "js"],
        ["config", "css"],
    ];
    var list = sourceTypes
        // @ts-ignore
        .map(function (t) { return manifest[t[0]] && manifest[t[0]][t[1]]; })
        .filter(function (i) { return !!i; })
        .reduce(function (a, b) { return a.concat(b); }, [])
        .filter(function (file) { return !/^https?:\/\//.test(file); });
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
function getAssetPaths(manifestJSONPath) {
    var manifest = JSON.parse(fs_1.default.readFileSync(manifestJSONPath, "utf-8"));
    return sourceList(manifest).map(function (file) {
        return path_1.default.resolve(path_1.default.dirname(manifestJSONPath), file);
    });
}
exports.getAssetPaths = getAssetPaths;
/**
 * Generate a plugin zip
 * @param manifestJSONPath
 * @param pluginZipPath
 * @param privateKey
 */
function generatePlugin(manifestJSONPath, privateKey) {
    return packFromManifest(manifestJSONPath, privateKey).then(function (output) { return ({ id: output.id, buffer: output.plugin }); });
}
exports.generatePlugin = generatePlugin;
