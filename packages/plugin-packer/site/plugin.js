"use strict";

const packer = require("../dist/");
const { rezip } = require("../dist/zip");
const { createDownloadUrl, revokeDownloadUrl } = require("./dom");

/**
 * Generate a plugin zip
 * @param {ArrayBuffer} contents
 * @param {string} privateKey
 * @return {Promise<*>}
 */
const generatePluginZip = (contents, privateKey) => {
  if (!contents) {
    return Promise.resolve();
  }
  return rezip(Buffer.from(contents)).then((contentsZip) =>
    packer(contentsZip, privateKey)
  );
};

/**
 * Validate plugin files
 * We use generatePlugin to validate plugin zip and ppk
 * @param {ArrayBuffer} contents
 * @param {string} privateKey
 * @return {Promise<*>}
 */
const validatePlugin = generatePluginZip;

/**
 * Create download URLs for a plugin and ppk
 * @param {{plugin: ArrayBuffer, privateKey: string}} result
 * @return {{plugin: string, ppk: string}}
 */
const createDownloadUrls = (result) => ({
  contents: createDownloadUrl(result.plugin, "application/zip"),
  ppk: createDownloadUrl(result.privateKey, "text/plain"),
});

/**
 * Create download URLs for a plugin and ppk
 * @param {Object<string, string>} plugin
 */
const revokePluginUrls = (plugin) => {
  Object.keys(plugin.url).forEach((key) => {
    revokeDownloadUrl(plugin.url[key]);
  });
};

module.exports = {
  generatePluginZip,
  validatePlugin,
  createDownloadUrls,
  revokePluginUrls,
};
