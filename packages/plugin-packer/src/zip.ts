"use strict";

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
const yazl = require("yazl");
const yauzl = require("yauzl");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'denodeify'... Remove this comment to see the full error message
const denodeify = require("denodeify");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validate'.
const validate = require("@kintone/plugin-manifest-validator");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'streamBuff... Remove this comment to see the full error message
const streamBuffers = require("stream-buffers");

const genErrorMsg = require("./gen-error-msg");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sourceList... Remove this comment to see the full error message
const sourceList = require("./sourcelist");

/**
 * Extract, validate and rezip contents.zip
 *
 * @param {!Buffer} contentsZip The zipped plugin contents directory.
 * @return {!Promise<!Buffer>}
 */
function rezip(contentsZip: any) {
  return preprocessToRezip(contentsZip).then(
    ({
      zipFile,
      entries,
      manifestJson,
      manifestPath
    }: any) => {
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
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validateCo... Remove this comment to see the full error message
function validateContentsZip(contentsZip: any) {
  return preprocessToRezip(
    contentsZip
  ).then(({
    entries,
    manifestJson,
    manifestPath
  }: any) =>
    validateManifest(entries, manifestJson, manifestPath)
  );
}

/**
 * Create an intermediate representation for contents.zip
 * @typedef {{zipFile: !yauzl.ZipFile,entries: !Map<string, !yauzl.ZipEntry>, manifestJson: Object, manifestPath: string}} PreprocessedContentsZip
 * @param {!Buffer} contentsZip
 * @return {Promise<PreprocessedContentsZip>}
 */
function preprocessToRezip(contentsZip: any) {
  return zipEntriesFromBuffer(contentsZip).then((result: any) => {
    const manifestList = Array.from(result.entries.keys()).filter(
      (file) => path.basename(file) === "manifest.json"
    );
    if (manifestList.length === 0) {
      throw new Error("The zip file has no manifest.json");
    } else if (manifestList.length > 1) {
      throw new Error("The zip file has many manifest.json files");
    }
    result.manifestPath = manifestList[0];
    const manifestEntry = result.entries.get(result.manifestPath);
    return getManifestJsonFromEntry(
      result.zipFile,
      manifestEntry
    ).then((json) => Object.assign(result, { manifestJson: json }));
  });
}

/**
 * @param {!Buffer} contentsZip
 * @return {!Promise<{zipFile: !yauzl.ZipFile, entries: !Map<string, !yauzl.ZipEntry>}>}
 */
function zipEntriesFromBuffer(contentsZip: any) {
  return denodeify(yauzl.fromBuffer)(contentsZip).then(
    (zipFile: any) => new Promise((res, rej) => {
      const entries = new Map();
      const result = {
        zipFile: zipFile,
        entries: entries,
      };
      zipFile.on("entry", (entry: any) => {
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
function zipEntryToString(zipFile: any, zipEntry: any) {
  return new Promise((res, rej) => {
    zipFile.openReadStream(zipEntry, (e: any, stream: any) => {
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
function getManifestJsonFromEntry(zipFile: any, zipEntry: any) {
  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
  return zipEntryToString(zipFile, zipEntry).then((str) => JSON.parse(str));
}

/**
 * @param {!Map<string, !yauzl.ZipEntry>} entries
 * @param {!Object} manifestJson
 * @param {string} manifestPath
 * @throws if manifest.json is invalid
 */
function validateManifest(entries: any, manifestJson: any, manifestPath: any) {
  // entry.fileName is a relative path separated by posix style(/) so this makes separators always posix style.
  const getEntryKey = (filePath: any) => path
    .join(path.dirname(manifestPath), filePath)
    .replace(new RegExp(`\\${path.sep}`, "g"), "/");
  const result = validate(manifestJson, {
    relativePath: (filePath: any) => entries.has(getEntryKey(filePath)),
    maxFileSize(maxBytes: any, filePath: any) {
      const entry = entries.get(getEntryKey(filePath));
      if (entry) {
        return entry.uncompressedSize <= maxBytes;
      }
      return false;
    },
  });
  if (!result.valid) {
    const errors = genErrorMsg(result.errors);
    const e = new Error(errors.join(", "));
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'validationErrors' does not exist on type... Remove this comment to see the full error message
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
function rezipContents(zipFile: any, entries: any, manifestJson: any, manifestPath: any) {
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
      sourceList(manifestJson).map((src: any) => {
        const entry = entries.get(path.join(manifestPrefix, src));
        return openReadStream(entry).then((stream: any) => {
          newZipFile.addReadStream(stream, src, {
            size: entry.uncompressedSize,
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
  validateContentsZip,
};
