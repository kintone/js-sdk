import * as chokidar from 'chokidar';

/**
 * Watch changes of the files, which returns a function to unwatch
 * @param files
 * @param cb
 */
export function watchFiles(
  files: string[],
  cb: (file: string) => void
): () => void {
  const watcher = chokidar.watch(files);
  watcher.on('change', file => {
    cb(file);
  });
  return () => files.map(f => watcher.unwatch(f));
}
