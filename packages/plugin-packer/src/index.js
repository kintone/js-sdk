"use strict";

const ZipFile = require("yazl").ZipFile;
const RSA = require("node-rsa");
const streamBuffers = require("stream-buffers");
const debug = require("debug")("packer");

const sign = require("./sign");
const uuid = require("./uuid");
const { validateContentsZip } = require("./zip");

/**
 * @param {!Buffer} contentsZip The zipped plugin contents directory.
 * @param {string=} privateKey The private key (PKCS#1 PEM).
 * @return {!Promise<{plugin: !Buffer, privateKey: string, id: string}>}
 */
function packer(contentsZip, privateKey_) {
  let privateKey = privateKey_;
  let key;
  if (privateKey) {
    key = new RSA(privateKey);
  } else {
    debug("generating a new key");
    key = new RSA({ b: 1024 });
    privateKey = key.exportKey("pkcs1-private");
  }

  const signature = sign(contentsZip, privateKey);
  const publicKey = key.exportKey("pkcs8-public-der");
  const id = uuid(publicKey);
  debug(`id : ${id}`);
  return validateContentsZip(contentsZip)
    .then(() => zip(contentsZip, publicKey, signature))
    .then(plugin => ({
      plugin: plugin,
      privateKey: privateKey,
      id: id
    }));
}

/**
 * Create plugin.zip
 *
 * @param {!Buffer} contentsZip
 * @param {!Buffer} publicKey
 * @param {!Buffer} signature
 * @return {!Promise<!Buffer>}
 */
function zip(contentsZip, publicKey, signature) {
  debug(`zip(): start`);
  return new Promise((res, rej) => {
    const output = new streamBuffers.WritableStreamBuffer();
    const zipFile = new ZipFile();
    output.on("finish", () => {
      debug(`zip(): output finish event`);
      res(output.getContents());
    });
    zipFile.outputStream.pipe(output);
    zipFile.addBuffer(contentsZip, "contents.zip");
    zipFile.addBuffer(publicKey, "PUBKEY");
    zipFile.addBuffer(signature, "SIGNATURE");
    zipFile.end(finalSize => {
      debug(`zip(): ZipFile end event: finalSize ${finalSize} bytes`);
    });
  });
}

module.exports = packer;
