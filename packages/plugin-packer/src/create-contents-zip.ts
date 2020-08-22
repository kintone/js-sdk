"use strict";

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ZipFile'.
const ZipFile = require("yazl").ZipFile;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'streamBuff... Remove this comment to see the full error message
const streamBuffers = require("stream-buffers");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'debug'.
const debug = require("debug")("create-contents-zip");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sourceList... Remove this comment to see the full error message
const sourceList = require("./sourcelist");

/**
 * Create a zipped contents
 *
 * @param {string} pluginDir
 * @param {!Object} manifest
 * @return {!Promise<!Buffer>}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCont... Remove this comment to see the full error message
function createContentsZip(pluginDir: any, manifest: any) {
  return new Promise((res, rej) => {
    const output = new streamBuffers.WritableStreamBuffer();
    const zipFile = new ZipFile();
    let size: any = null;
    output.on("finish", () => {
      debug(`plugin.zip: ${size} bytes`);
      res(output.getContents());
    });
    zipFile.outputStream.pipe(output);
    sourceList(manifest).forEach((src: any) => {
      zipFile.addFile(path.join(pluginDir, src), src);
    });
    zipFile.end((finalSize: any) => {
      size = finalSize;
    });
  });
}

module.exports = createContentsZip;
