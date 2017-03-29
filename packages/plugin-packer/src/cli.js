'use strict';

const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const denodeify = require('denodeify');
const writeFile = denodeify(fs.writeFile);
const recursive = denodeify(require('recursive-readdir'));
const streamBuffers = require('stream-buffers');
const debug = require('debug')('cli');

const packer = require('./');

/**
 * @param {string} pluginDir path to plugin directory.
 * @param {Object=} options {ppk: string}.
 * @return {!Promise<string>} The resolved value is a path to the output plugin zip file.
 */
function cli(pluginDir, options) {
  options = options || {};
  const packerLocal = options.packerMock_ ? options.packerMock_ : packer;

  // 1. check if pluginDir is a directory
  if (!fs.statSync(pluginDir).isDirectory()) {
    throw new Error(`${pluginDir} should be a directory.`);
  }

  // 2. check pluginDir/manifest.json
  if (!fs.statSync(path.join(pluginDir, 'manifest.json')).isFile()) {
    throw new Error('Manifest file $PLUGIN_DIR/manifest.json not found.');
  }

  const outputDir = path.dirname(path.resolve(pluginDir));
  debug(`outDir : ${outputDir}`);

  return recursive(pluginDir).then(files => {
    files.forEach(file => {
      const basename = path.basename(file);
      // 3. check dot files
      if (/^\./.test(basename)) {
        throw new Error(`PLUGIN_DIR must not contain dot files or directories : ${file}`);
      }
      // 4. check *.ppk
      if (/\.ppk$/.test(basename)) {
        throw new Error(`PLUGIN_DIR must not contain * .ppk : ${file}`);
      }
    });
  }).then(() => {
    // 5. generate new ppk if not specified
    const ppkFile = options.ppk;
    let privateKey;
    if (ppkFile) {
      debug(`loading an existing key: ${ppkFile}`);
      privateKey = fs.readFileSync(ppkFile, 'utf8');
    }

    // 6. package plugin.zip
    return createContentsZip(pluginDir)
      .then(contentsZip => packerLocal(contentsZip, privateKey))
      .then(output => {
        if (!ppkFile) {
          fs.writeFileSync(path.join(outputDir, `${output.id}.ppk`), output.privateKey, 'utf8');
        }
        return outputPlugin(outputDir, output.plugin);
      });
  });
}

module.exports = cli;

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
 * @param {string} outputDir
 * @param {!Buffer} plugin
 * @return {!Promise<string>} The value is output path of plugin.zip.
 */
function outputPlugin(outputDir, plugin) {
  const outputPath = path.join(outputDir, 'plugin.zip');
  return writeFile(outputPath, plugin)
    .then(arg => outputPath);
}
