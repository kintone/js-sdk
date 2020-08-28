"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var lodash_1 = require("lodash");
var mkdirp_1 = __importDefault(require("mkdirp"));
var path_1 = __importDefault(require("path"));
var plugin_1 = require("./plugin");
var watch_1 = require("./watch");
var KintonePlugin = /** @class */ (function () {
    function KintonePlugin(options) {
        if (options === void 0) { options = {}; }
        this.name = "KintonePlugin";
        this.privateKey = null;
        this.options = Object.assign({
            manifestJSONPath: "./plugin/manifest.json",
            privateKeyPath: "./private.ppk",
            pluginZipPath: "./dist/plugin.zip",
        }, options);
    }
    KintonePlugin.prototype.apply = function (compiler) {
        var _this = this;
        var _a = this.options, manifestJSONPath = _a.manifestJSONPath, privateKeyPath = _a.privateKeyPath, pluginZipPath = _a.pluginZipPath;
        compiler.hooks.afterPlugins.tap("KintonePlugin", function () {
            if (!fs_1.default.existsSync(manifestJSONPath)) {
                throw new Error("manifestJSONPath cannot found: " + manifestJSONPath);
            }
            if (!fs_1.default.existsSync(privateKeyPath)) {
                throw new Error("privateKeyPath cannot found: " + privateKeyPath);
            }
            _this.privateKey = fs_1.default.readFileSync(privateKeyPath, "utf-8");
            if (compiler.options.watch) {
                _this.watchAssets();
            }
            else {
                compiler.hooks.afterEmit.tapPromise(_this.name, function (compilation) {
                    return _this.generatePlugin();
                });
            }
        });
    };
    /**
     * Watch assets specified in manifest.json
     */
    KintonePlugin.prototype.watchAssets = function () {
        var _this = this;
        var unwatch;
        var onFileChange = lodash_1.debounce(function (file) {
            console.log(file + " was changed");
            _this.generatePlugin().then(function () {
                // If manifest.json has been updated we should reevaluate the target files and rewatch them
                if (/manifest\.json$/.test(file)) {
                    if (typeof unwatch === "function") {
                        unwatch();
                    }
                    unwatch = watch_1.watchFiles(plugin_1.getAssetPaths(_this.options.manifestJSONPath), onFileChange);
                }
            });
        });
        unwatch = watch_1.watchFiles(plugin_1.getAssetPaths(this.options.manifestJSONPath), onFileChange);
    };
    /**
     * Generate a plugin zip
     */
    KintonePlugin.prototype.generatePlugin = function () {
        var _a = this.options, manifestJSONPath = _a.manifestJSONPath, pluginZipPath = _a.pluginZipPath;
        return plugin_1.generatePlugin(manifestJSONPath, this.privateKey).then(function (result) {
            var zipPath = 
            // You can customize the zip file name using the plugin id and manifest
            typeof pluginZipPath === "function"
                ? pluginZipPath(result.id, JSON.parse(fs_1.default.readFileSync(manifestJSONPath, "utf-8")))
                : pluginZipPath;
            var zipDir = path_1.default.dirname(zipPath);
            if (!fs_1.default.existsSync(zipDir)) {
                mkdirp_1.default.sync(zipDir);
            }
            fs_1.default.writeFileSync(zipPath, result.buffer);
            console.log("----------------------");
            console.log("Success to create a plugin zip!");
            console.log("Plugin ID: " + result.id);
            console.log("Path: " + zipPath);
            console.log("----------------------");
        });
    };
    return KintonePlugin;
}());
module.exports = KintonePlugin;
module.exports.default = module.exports;
