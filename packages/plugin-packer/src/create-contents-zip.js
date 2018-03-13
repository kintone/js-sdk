'use strict';

const path = require('path');
const ZipFile = require('yazl').ZipFile;

const streamBuffers = require('stream-buffers');
const debug = require('debug')('create-contents-zip');

const sourceList = require('./sourcelist');

/**
 * Create a zipped contents
 *
 * @param {string} pluginDir
 * @param {!Object} manifest
 * @return {!Promise<!Buffer>}
 */
function createContentsZip(pluginDir, manifest) {
  return new Promise((res, rej) => {
    const output = new streamBuffers.WritableStreamBuffer();
    const zipFile = new ZipFile();
    let size = null;
    output.on('finish', () => {
      debug(`plugin.zip: ${size} bytes`);
      res(output.getContents());
    });
    zipFile.outputStream.pipe(output);
    sourceList(manifest).forEach(src => {
      zipFile.addFile(path.join(pluginDir, src), src);
    });
    zipFile.end(finalSize => {
      size = finalSize;
    });
  });
}

module.exports = createContentsZip;
