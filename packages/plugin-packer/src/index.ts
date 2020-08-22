"use strict";

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ZipFile'.
const ZipFile = require("yazl").ZipFile;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RSA'.
const RSA = require("node-rsa");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'streamBuff... Remove this comment to see the full error message
const streamBuffers = require("stream-buffers");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'debug'.
const debug = require("debug")("packer");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sign'.
const sign = require("./sign");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'uuid'.
const uuid = require("./uuid");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validateCo... Remove this comment to see the full error message
const { validateContentsZip } = require("./zip");

/**
 * @param {!Buffer} contentsZip The zipped plugin contents directory.
 * @param {string=} privateKey The private key (PKCS#1 PEM).
 * @return {!Promise<{plugin: !Buffer, privateKey: string, id: string}>}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'packer'.
function packer(contentsZip: any, privateKey_: any) {
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
    .then((plugin: any) => ({
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
function zip(contentsZip: any, publicKey: any, signature: any) {
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
    zipFile.end((finalSize: any) => {
      debug(`zip(): ZipFile end event: finalSize ${finalSize} bytes`);
    });
  });
}

module.exports = packer;
