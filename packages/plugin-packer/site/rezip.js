'use strict';

const yauzl = require('yauzl');
const fromBuffer = require('denodeify')(yauzl.fromBuffer);
const validate = require('@teppeis/kintone-plugin-manifest-validator');
const streamBuffers = require('stream-buffers');

const genErrorMsg = require('../src/gen-error-msg');

/**
 * Extract, validate and rezip contents.zip
 *
 * @param {!Buffer} contentsZip The zipped plugin contents directory.
 * @return {!Promise<!Buffer>}
 */
function rezip(contentsZip) {
  const files = [];
  const entries = {};

  return fromBuffer(contentsZip)
    .then(zipFile => new Promise((res, rej) => {
      zipFile.on('entry', entry => {
        files.push(entry.fileName);
        entries[entry.fileName] = entry;
      });
      zipFile.on('end', entry => {
        res(zipFile);
      });
      zipFile.on('error', error => {
        rej(error);
      });
    }))
  .then(zipFile => {
    const manifestList = files.filter(file => /(^|\/)manifest.json$/.test(file));
    if (manifestList.length === 0) {
      throw new Error('The zip file has no manifest.json');
    } else if (manifestList.length > 1) {
      throw new Error('The zip file has many manifest.json files');
    }
    return new Promise((res, rej) => {
      zipFile.openReadStream(entries[manifestList[0]], (e, stream) => {
        if (e) {
          rej(e);
          return;
        }
        const output = new streamBuffers.WritableStreamBuffer();
        output.on('finish', () => {
          res(output.getContents().toString('utf8'));
        });
        stream.pipe(output);
      });
    });
  })
  .then(manifestJson => validate(JSON.parse(manifestJson)))
  .then(result => {
    if (result.valid) {
      return contentsZip;
    } else {
      const errors = genErrorMsg(result.errors);
      const e = new Error(errors.join(', '));
      e.validationErrors = errors;
      throw e;
    }
  });
}

module.exports = rezip;
