"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchFiles = void 0;
var chokidar_1 = __importDefault(require("chokidar"));
var os_1 = __importDefault(require("os"));
/**
 * Watch changes of the files, which returns a function to unwatch
 * @param files
 * @param cb
 */
function watchFiles(files, cb) {
    // change events are fired before chagned files are flushed on Windows,
    // which generate an invalid plugin zip.
    // in order to fix this, we use awaitWriteFinish option only on Windows.
    var watchOptions = os_1.default.platform() === "win32"
        ? {
            awaitWriteFinish: {
                stabilityThreshold: 1000,
                pollInterval: 250,
            },
        }
        : {};
    var watcher = chokidar_1.default.watch(files, watchOptions);
    watcher.on("change", function (file) {
        cb(file);
    });
    return function () { return files.map(function (f) { return watcher.unwatch(f); }); };
}
exports.watchFiles = watchFiles;
