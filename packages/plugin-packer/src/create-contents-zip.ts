import path from "path";
import { ZipFile } from "yazl";
import streamBuffers from "stream-buffers";
import { sourceList } from "./sourcelist";
import _debug from "debug";

const debug = _debug("create-contents-zip");

/**
 * Create a zipped contents
 */
export function createContentsZip(
  pluginDir: string,
  manifest: any
): Promise<false | Buffer> {
  return new Promise((res, rej) => {
    const output = new streamBuffers.WritableStreamBuffer();
    const zipFile = new ZipFile();
    let size: any = null;
    output.on("finish", () => {
      debug(`plugin.zip: ${size} bytes`);
      res(output.getContents());
    });
    zipFile.outputStream.pipe(output);
    sourceList(manifest).forEach((src) => {
      zipFile.addFile(path.join(pluginDir, src), src);
    });
    zipFile.end(undefined, ((finalSize: number) => {
      size = finalSize;
    }) as any);
  });
}
