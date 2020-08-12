"use strict";

const fs = require("fs");
const path = require("path");

const packer = require("./index");
const createContentsZip = require("./create-contents-zip");

/**
 * @param {!string} manifestJSONPath The path of the manifest.json for the plugin
 * @param {string=} privateKey The private key (PKCS#1 PEM).
 * @return {!Promise<{plugin: !Buffer, privateKey: string, id: string}>}
 */
function packPluginFromManifest(manifestJSONPath, privateKey) {
  return new Promise((resolve, reject) => {
    try {
      resolve(JSON.parse(fs.readFileSync(manifestJSONPath, "utf-8")));
    } catch (e) {
      reject(e);
    }
  })
    .then((manifest) =>
      createContentsZip(path.dirname(manifestJSONPath), manifest)
    )
    .then((buffer) => packer(buffer, privateKey));
}

module.exports = packPluginFromManifest;
