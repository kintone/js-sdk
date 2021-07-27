import chokidar from "chokidar";
import os from "os";

/**
 * Watch changes of the files, which returns a function to unwatch
 * @param files
 * @param cb
 */
export const watchFiles = (
  files: string[],
  cb: (file: string) => void
): (() => void) => {
  // change events are fired before chagned files are flushed on Windows,
  // which generate an invalid plugin zip.
  // in order to fix this, we use awaitWriteFinish option only on Windows.
  const watchOptions =
    os.platform() === "win32"
      ? {
          awaitWriteFinish: {
            stabilityThreshold: 1000,
            pollInterval: 250,
          },
        }
      : {};
  const watcher = chokidar.watch(files, watchOptions);
  watcher.on("change", (file) => {
    cb(file);
  });
  return () => files.map((f) => watcher.unwatch(f));
};
