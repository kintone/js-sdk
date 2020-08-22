"use strict";

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("fs");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'packer'.
const packer = require("./index");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCont... Remove this comment to see the full error message
const createContentsZip = require("./create-contents-zip");

/**
 * @param {!string} manifestJSONPath The path of the manifest.json for the plugin
 * @param {string=} privateKey The private key (PKCS#1 PEM).
 * @return {!Promise<{plugin: !Buffer, privateKey: string, id: string}>}
 */
function packPluginFromManifest(manifestJSONPath: any, privateKey: any) {
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
