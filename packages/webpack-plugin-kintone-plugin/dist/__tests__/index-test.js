"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var adm_zip_1 = __importDefault(require("adm-zip"));
var child_process_1 = require("child_process");
var fs_1 = __importDefault(require("fs"));
var os_1 = __importDefault(require("os"));
var path_1 = __importDefault(require("path"));
var rimraf_1 = __importDefault(require("rimraf"));
var pluginDir = path_1.default.resolve(__dirname, "sample");
var pluginZipPath = path_1.default.resolve(pluginDir, "dist", "plugin.zip");
var pluginJSPath = path_1.default.resolve(pluginDir, "plugin", "js", "customize.js");
var customNamePluginZipPath = path_1.default.resolve(pluginDir, "dist", "nfjiheanbocphdnoehhpddjmkhciokjb.sample.plugin.zip");
var notExistsDirPluginZipPath = path_1.default.resolve(pluginDir, "dist", "new", "to", "plugin.zip");
var notExistsDirWithCustomNamePluginZipPath = path_1.default.resolve(pluginDir, "dist", "new", "to", "nfjiheanbocphdnoehhpddjmkhciokjb.sample.plugin.zip");
var runWebpack = function (config) {
    if (config === void 0) { config = "webpack.config.js"; }
    var webpackCommand = "webpack" + (os_1.default.platform() === "win32" ? ".cmd" : "");
    return child_process_1.spawnSync(webpackCommand, ["--config", config, "--mode", "production"], {
        cwd: pluginDir,
    });
};
var verifyPluginZip = function (zipPath) {
    expect(fs_1.default.existsSync(zipPath)).toBe(true);
    var zip = new adm_zip_1.default(zipPath);
    expect(zip.getEntries().map(function (entry) { return entry.entryName; })).toStrictEqual(["contents.zip", "PUBKEY", "SIGNATURE"]);
};
describe("KintonePlugin", function () {
    afterEach(function () {
        // Cleanup the zip
        [pluginZipPath, customNamePluginZipPath, pluginJSPath].forEach(function (generatedFilePath) {
            try {
                fs_1.default.unlinkSync(generatedFilePath);
            }
            catch (e) {
                // noop
            }
        });
        rimraf_1.default.sync(path_1.default.resolve(pluginDir, "dist", "new"));
    });
    it("should be able to create a plugin zip", function () {
        var rs = runWebpack();
        expect(rs.error).toBeUndefined();
        verifyPluginZip(pluginZipPath);
    });
    it("should be able to customize the zip name", function () {
        var rs = runWebpack("webpack.config.customize.name.js");
        expect(rs.error).toBeUndefined();
        verifyPluginZip(customNamePluginZipPath);
    });
    it("should be able to create the zip directory if it does not exist", function () {
        var rs = runWebpack("webpack.config.not.exists.dir.js");
        expect(rs.error).toBeUndefined();
        verifyPluginZip(notExistsDirPluginZipPath);
    });
    it("should be able to create the zip directory if it does not exist and using customize the zip name", function () {
        var rs = runWebpack("webpack.config.not.exists.dir.with.customize.name.js");
        expect(rs.error).toBeUndefined();
        verifyPluginZip(notExistsDirWithCustomNamePluginZipPath);
    });
});
