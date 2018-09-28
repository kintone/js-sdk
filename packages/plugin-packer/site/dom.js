"use strict";

const flatten = require("array-flatten");
const yazl = require("yazl");
const streamBuffers = require("stream-buffers");

/**
 * Revoke an object URL
 * @param {string} url
 * @return {void}
 */
const revokeDownloadUrl = url => URL.revokeObjectURL(url);

/**
 * Create an object URL for the data
 * @param {*} data
 * @param {string} type
 * @return {string}
 */
const createDownloadUrl = (data, type) =>
  URL.createObjectURL(new Blob([data], { type }));

const isDropEvent = e => e.type === "drop";

/**
 *  Read files from FileSystemEntry
 * @typedef {{path: string, file: File}} FileEntry
 * @param {FileSystemEntry} entry
 * @return {Promise<FileEntry | FileEntry[]>}
 * */
const readEntries = entry =>
  new Promise((resolve, reject) => {
    if (entry.isFile) {
      // Convert the fullPath to the relative path from the plugin directory
      entry.file(file =>
        resolve({ path: entry.fullPath.replace(/^\/[^/]+?\//, ""), file })
      );
    } else if (entry.isDirectory) {
      entry.createReader().readEntries(childEntries => {
        Promise.all(
          childEntries.map(childEntry => readEntries(childEntry))
        ).then(resolve);
      });
    } else {
      reject(new Error("Unsupported file system entry specified"));
    }
  });

/**
 * Get a file or a file list from Event
 * @param {Event} e
 * @return {Promise<File | {name: string, entries: Map<string, File>}>}
 */
const getFileFromEvent = e => {
  if (!isDropEvent(e)) {
    const files = e.target.files;
    if (files.length === 1) {
      return Promise.resolve(files[0]);
    }
    // Create a Map<path, File>
    return Promise.resolve({
      // Get a uploaded directory name from webkitRelativePath
      name: files[0].webkitRelativePath.replace(/\/.*/, ""),
      entries: new Map(
        Array.from(files).map(file => [file.webkitRelativePath, file])
      )
    });
  }
  if (
    typeof e.dataTransfer.items === "undefined" ||
    typeof e.dataTransfer.items[0].webkitGetAsEntry !== "function"
  ) {
    // We assume a string was dropped if we can't get the File object
    const file = e.dataTransfer.files[0];
    if (!file) {
      return Promise.reject(new Error("Unsupported file type item specified"));
    }
    // the upload file name doesn't have any dot so we can infer the file is a directory
    if (file.name.indexOf(".") === -1) {
      return Promise.reject(
        new Error("Your browser doesn't support a directory upload")
      );
    }
    return Promise.resolve(file);
  }
  return new Promise((resolve, reject) => {
    const dataTransferItem = e.dataTransfer.items[0];
    if (dataTransferItem.kind !== "file") {
      reject(new Error("Unsupported file type item specified"));
      return;
    }
    const entry = dataTransferItem.webkitGetAsEntry();
    if (entry.isFile) {
      entry.file(resolve);
    } else if (entry.isDirectory) {
      readEntries(entry).then(entries => {
        resolve({
          name: entry.name,
          // Create a Map<path, File>
          entries: new Map(
            flatten(entries).map(({ path, file }) => [path, file])
          )
        });
      });
    } else {
      reject(new Error("Unsupported file system entry specified"));
    }
  });
};

/**
 * Create an handler for an event to convert a File
 * @param {function(promise: Promise<File>): void} cb
 * @return {function(e: Event)}
 */
const createFileHanlder = cb => e => {
  if (isDropEvent(e)) {
    e.preventDefault();
  }
  cb(getFileFromEvent(e));
};

/**
 * Read a file and return it as an text
 * @param {File} file
 * @return {Promise<string>}
 */
const readText = file =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsText(file);
  });

/**
 * Read a file and return it as an array buffer
 * @param {File} file
 * @return {Promise<ArrayBuffer>}
 */
const readArrayBuffer = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
/**
 * register an event handler
 * @param {HTMLElement|NodeList} el
 * @param {*} args
 */
const listen = (el, ...args) => {
  if (el instanceof NodeList) {
    el.forEach(e => listen(...[e, ...args]));
    return;
  }
  el.addEventListener(...args);
};

/**
 * Create a buffer of the zip file
 * @typedef {{file: File, fullPath: string}} FileEntry
 * @param {Map<string, File>} fileMap
 * @return {Promise<Buffer>}
 */
function fileMapToBuffer(fileMap) {
  return Promise.all(
    Array.from(fileMap.entries()).map(([path, file]) =>
      readArrayBuffer(file).then(buffer => ({ buffer, path }))
    )
  )
    .then(results => {
      const zipFile = new yazl.ZipFile();
      results.forEach(result => {
        zipFile.addBuffer(Buffer.from(result.buffer), result.path);
      });
      zipFile.end();
      return zipFile;
    })
    .then(
      zipFile =>
        new Promise(resolve => {
          const output = new streamBuffers.WritableStreamBuffer();
          output.on("finish", () => {
            resolve(output.getContents());
          });
          zipFile.outputStream.pipe(output);
        })
    );
}

module.exports = {
  $,
  $$,
  fileMapToBuffer,
  listen,
  revokeDownloadUrl,
  createDownloadUrl,
  createFileHanlder,
  readText,
  readArrayBuffer
};
