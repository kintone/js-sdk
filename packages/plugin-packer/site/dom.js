'use strict';

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
const createDownloadUrl = (data, type) => URL.createObjectURL(
  new Blob([data], {type})
);

const isDropEvent = e => e.type === 'drop';

const getFileFromEvent = e => (
  isDropEvent(e) ?
    e.dataTransfer.files[0] :
    e.target.files[0]
);

/**
 * Create an handler for an event to convert a File
 * @param {function(file: File): Promise<*>} cb
 * @return {function(e: Event)}
 */
const createFileHanlder = cb => e => {
  const file = getFileFromEvent(e);
  if (!file) {
    return;
  }
  if (isDropEvent(e)) {
    e.preventDefault();
  }
  return cb(file);
};

/**
 * Read a file and return it as an text
 * @param {File} file
 * @return {Promise<string>}
 */
const readText = file => (
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsText(file);
  })
);

/**
 * Read a file and return it as an array buffer
 * @param {File} file
 * @return {Promise<ArrayBuffer>}
 */
const readArrayBuffer = file => (
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsArrayBuffer(file);
  })
);

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

module.exports = {
  $,
  $$,
  listen,
  revokeDownloadUrl,
  createDownloadUrl,
  createFileHanlder,
  readText,
  readArrayBuffer,
};
