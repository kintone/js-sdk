"use strict";

const path = require("path");
const yazl = require("yazl");
const yauzl = require("yauzl");
const denodeify = require("denodeify");
const validate = require("@kintone/plugin-manifest-validator");
const streamBuffers = require("stream-buffers");

const genErrorMsg = require("./gen-error-msg");
const sourceList = require("./sourcelist");

/**
 * Extract, validate and rezip contents.zip
 *
 * @param {!Buffer} contentsZip The zipped plugin contents directory.
 * @return {!Promise<!Buffer>}
 */
function rezip(contentsZip) {
  return preprocessToRezip(contentsZip).then(
    ({ zipFile, entries, manifestJson, manifestPath }) => {
      validateManifest(entries, manifestJson, manifestPath);
      return rezipContents(zipFile, entries, manifestJson, manifestPath);
    }
  );
}

/**
 * Validate a buffer of contents.zip
 * @param {!Buffer} contentsZip
 * @return {!Promise<*>}
 */
function validateContentsZip(contentsZip) {
  return preprocessToRezip(
    contentsZip
  ).then(({ entries, manifestJson, manifestPath }) =>
    validateManifest(entries, manifestJson, manifestPath)
  );
}

/**
 * Create an intermediate representation for contents.zip
 * @typedef {{zipFile: !yauzl.ZipFile,entries: !Map<string, !yauzl.ZipEntry>, manifestJson: Object, manifestPath: string}} PreprocessedContentsZip
 * @param {!Buffer} contentsZip
 * @return {Promise<PreprocessedContentsZip>}
 */
function preprocessToRezip(contentsZip) {
  return zipEntriesFromBuffer(contentsZip).then(result => {
    const manifestList = Array.from(result.entries.keys()).filter(
      file => path.basename(file) === "manifest.json"
    );
    if (manifestList.length === 0) {
      throw new Error("The zip file has no manifest.json");
    } else if (manifestList.length > 1) {
      throw new Error("The zip file has many manifest.json files");
    }
    result.manifestPath = manifestList[0];
    const manifestEntry = result.entries.get(result.manifestPath);
    return getManifestJsonFromEntry(result.zipFile, manifestEntry).then(json =>
      Object.assign(result, { manifestJson: json })
    );
  });
}

/**
 * @param {!Buffer} contentsZip
 * @return {!Promise<{zipFile: !yauzl.ZipFile, entries: !Map<string, !yauzl.ZipEntry>}>}
 */
function zipEntriesFromBuffer(contentsZip) {
  return denodeify(yauzl.fromBuffer)(contentsZip).then(
    zipFile =>
      new Promise((res, rej) => {
        const entries = new Map();
        const result = {
          zipFile: zipFile,
          entries: entries
        };
        zipFile.on("entry", entry => {
          entries.set(entry.fileName, entry);
        });
        zipFile.on("end", () => {
          res(result);
        });
        zipFile.on("error", rej);
      })
  );
}

/**
 * @param {!yauzl.ZipFile} zipFile
 * @param {!yauzl.ZipEntry} zipEntry
 * @return {!Promise<string>}
 */
function zipEntryToString(zipFile, zipEntry) {
  return new Promise((res, rej) => {
    zipFile.openReadStream(zipEntry, (e, stream) => {
      if (e) {
        rej(e);
      } else {
        const output = new streamBuffers.WritableStreamBuffer();
        output.on("finish", () => {
          res(output.getContents().toString("utf8"));
        });
        stream.pipe(output);
      }
    });
  });
}

/**
 * @param {!yauzl.ZipFile} zipFile
 * @param {!yauzl.ZipEntry} zipEntry
 * @return {!Promise<string>}
 */
function getManifestJsonFromEntry(zipFile, zipEntry) {
  return zipEntryToString(zipFile, zipEntry).then(str => JSON.parse(str));
}

/**
 * @param {!Map<string, !yauzl.ZipEntry>} entries
 * @param {!Object} manifestJson
 * @param {string} manifestPath
 * @throws if manifest.json is invalid
 */
function validateManifest(entries, manifestJson, manifestPath) {
  // entry.fileName is a relative path separated by posix style(/) so this makes separators always posix style.
  const getEntryKey = filePath =>
    path
      .join(path.dirname(manifestPath), filePath)
      .replace(new RegExp(`\\${path.sep}`, "g"), "/");
  const result = validate(manifestJson, {
    relativePath: filePath => entries.has(getEntryKey(filePath)),
    maxFileSize(maxBytes, filePath) {
      const entry = entries.get(getEntryKey(filePath));
      if (entry) {
        return entry.uncompressedSize <= maxBytes;
      }
      return false;
    }
  });
  if (!result.valid) {
    const errors = genErrorMsg(result.errors);
    const e = new Error(errors.join(", "));
    e.validationErrors = errors;
    throw e;
  }
}

/**
 * @param {!yauzl.ZipFile} zipFile
 * @param {!Map<string, !yauzl.ZipEntry>} entries
 * @param {!Object} manifestJson
 * @param {string} manifestPath
 * @return {!Promise<!Buffer>}
 */
function rezipContents(zipFile, entries, manifestJson, manifestPath) {
  const manifestPrefix = path.dirname(manifestPath);

  return new Promise((res, rej) => {
    const newZipFile = new yazl.ZipFile();
    newZipFile.on("error", rej);
    const output = new streamBuffers.WritableStreamBuffer();
    output.on("finish", () => {
      res(output.getContents());
    });
    newZipFile.outputStream.pipe(output);
    const openReadStream = denodeify(zipFile.openReadStream.bind(zipFile));
    Promise.all(
      sourceList(manifestJson).map(src => {
        const entry = entries.get(path.join(manifestPrefix, src));
        return openReadStream(entry).then(stream => {
          newZipFile.addReadStream(stream, src, {
            size: entry.uncompressedSize
          });
        });
      })
    ).then(() => {
      newZipFile.end();
    });
  });
}

module.exports = {
  rezip,
  validateContentsZip
};
