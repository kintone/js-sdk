'use strict';

const archiver = require('archiver');
const RSA = require('node-rsa');
const streamBuffers = require('stream-buffers');
const debug = require('debug')('packer');

const sign = require('./sign');
const uuid = require('./uuid');

/**
 * @param {!Buffer} contentsZip The zipped plugin contents directory.
 * @param {string=} privateKey The private key (PKCS#1 PEM).
 * @return {!Promise<{plugin: !Buffer, privateKey: string, id: string}>}
 */
function packer(contentsZip, privateKey) {
  return Promise.resolve().then(() => {
    let key;
    if (privateKey) {
      key = new RSA(privateKey);
    } else {
      debug('generating a new key');
      key = new RSA({b: 1024});
      privateKey = key.exportKey('pkcs1-private');
    }

    const signature = sign(contentsZip, privateKey);
    const publicKey = key.exportKey('pkcs8-public-der');
    const id = uuid(publicKey);
    debug(`id : ${id}`);
    return zip(contentsZip, publicKey, signature)
      .then(plugin => ({plugin: plugin, privateKey: privateKey, id: id}));
  });
}

/**
 * Create plugin.zip
 *
 * @param {!Buffer|!stream.Readable|string} contentsZip
 * @param {!Buffer|!stream.Readable|string} publicKey
 * @param {!Buffer|!stream.Readable|string} signature
 * @return {!Promise<!Buffer>}
 */
function zip(contentsZip, publicKey, signature) {
  return new Promise((res, rej) => {
    const output = new streamBuffers.WritableStreamBuffer();
    const archive = archiver('zip');
    output.on('finish', () => {
      debug(`plugin.zip: ${archive.pointer()} bytes`);
      res(output.getContents());
    });
    archive.pipe(output);
    archive.on('error', e => {
      rej(e);
    });
    archive.append(contentsZip, {name: 'contents.zip'});
    archive.append(publicKey, {name: 'PUBKEY'});
    archive.append(signature, {name: 'SIGNATURE'});
    archive.finalize();
  });
}

module.exports = packer;
