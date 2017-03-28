'use strict';

const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const RSA = require('node-rsa');
const denodeify = require('denodeify');
const recursive = denodeify(require('recursive-readdir'));
const streamBuffers = require('stream-buffers');
const debug = require('debug')('packer');

const sign = require('./sign');
const uuid = require('./calc-uuid');

/**
 * @param {string} pluginDir path to plugin directory.
 * @param {Object=} options {ppk: string}.
 * @return {Promise<string>} The resolved value is a path to the output plugin zip file.
 */
function packer(pluginDir, options) {
  options = options || {};

  // 1. check if pluginDir is a directory
  if (!fs.statSync(pluginDir).isDirectory()) {
    throw new Error(`${pluginDir} should be a directory.`);
  }

  // 2. check pluginDir/manifest.json
  if (!fs.statSync(path.join(pluginDir, 'manifest.json')).isFile()) {
    throw new Error('Manifest file $PLUGIN_DIR/manifest.json not found.');
  }

  const outputDir = path.dirname(path.resolve(pluginDir));
  debug(`outDir: ${outputDir}`);

  return recursive(pluginDir).then(files => {
    files.forEach(file => {
      const basename = path.basename(file);
      // 3. check dot files
      if (/^\./.test(basename)) {
        throw new Error(`PLUGIN_DIR must not contain dot files or directories: ${file}`);
      }
      // 4. check *.ppk
      if (/\.ppk$/.test(basename)) {
        throw new Error(`PLUGIN_DIR must not contain *.ppk: ${file}`);
      }
    });
  }).then(() => {
    // 5. generate new ppk if not specified
    const ppkFile = options.ppk;
    let key;
    let privateKey;
    if (ppkFile) {
      debug(`loading an existing key: ${ppkFile}`);
      privateKey = fs.readFileSync(ppkFile, 'utf8');
      key = new RSA(privateKey);
    } else {
      debug('generating a new key');
      key = new RSA({b: 1024});
      privateKey = key.exportKey('pkcs1-private');
    }

    // 6. zip plugin contents
    return createContentsZip(pluginDir).then(contentsZip => {
      // 7. sign to contents
      const signature = sign(contentsZip, privateKey);

      // 8. export public key
      const publicKey = key.exportKey('pkcs8-public-der');

      if (!ppkFile) {
        // 9. calc UUID
        const id = uuid(publicKey);
        debug(`id: ${id}`);
        // 10. output private key if nothing
        fs.writeFileSync(path.join(outputDir, `${id}.ppk`), privateKey, 'utf8');
      }
      // 11. zip plugin
      const outputPath = path.join(outputDir, 'plugin.zip');
      return outputPlugin(outputPath, contentsZip, publicKey, signature);
    });
  });
}

module.exports = packer;

/**
 * Create contents.zip
 *
 * @param {string} pluginDir
 * @return {!Promise<!Buffer>}
 */
function createContentsZip(pluginDir) {
  return new Promise((res, rej) => {
    const output = new streamBuffers.WritableStreamBuffer();
    const archive = archiver('zip');
    output.on('finish', () => {
      debug(`contents.zip: ${archive.pointer()} bytes`);
      res(output.getContents());
    });
    archive.pipe(output);
    archive.on('error', e => {
      rej(e);
    });
    archive.directory(pluginDir, '.');
    archive.finalize();
  });
}

/**
 * Create and save plugin.zip
 *
 * @param {string} outputPath
 * @param {!Buffer|!stream.Readable|string} contentsZip
 * @param {!Buffer|!stream.Readable|string} publicKey
 * @param {!Buffer|!stream.Readable|string} signature
 * @return {!Promise<undefined>}
 */
function outputPlugin(outputPath, contentsZip, publicKey, signature) {
  return new Promise((res, rej) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip');
    output.on('close', () => {
      debug(`plugin.zip: ${archive.pointer()} bytes`);
      res(outputPath);
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
