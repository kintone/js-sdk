'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const denodeify = require('denodeify');
const rimraf = denodeify(require('rimraf'));
const sinon = require('sinon');
const glob = require('glob');

const cli = require('../src/cli');
const outDir = path.join(__dirname, 'fixtures', 'sample-plugin');
const pluginDir = path.join(outDir, 'plugin-dir');
const ppkPath = path.join(__dirname, 'fixtures/private.ppk');

const ID = 'aaa';
const PRIVATE_KEY = 'PRIVATE_KEY';
const PLUGIN_BUFFER = Buffer.from('foo');

describe('cli', () => {
  it('is a function', () => {
    assert(typeof cli === 'function');
  });

  context('without ppk', () => {
    let packer;
    let pluginFilePath;
    beforeEach(() => {
      packer = sinon.stub().returns({
        id: ID,
        privateKey: PRIVATE_KEY,
        plugin: PLUGIN_BUFFER,
      });

      return rimraf(`${outDir}/*.*(ppk|zip)`)
        .then(() => cli(pluginDir, {packerMock_: packer}))
        .then(filePath => {
          pluginFilePath = filePath;
        });
    });

    it('calles `packer` with contents.zip as the 1st argument', () => {
      assert(packer.calledOnce);
      assert(packer.args[0][0]);
      const zip = new AdmZip(packer.args[0][0]);
      const files = zip.getEntries().map(entry => entry.entryName).sort();
      assert.deepEqual(files, [
        './image/',
        './image/icon.png',
        './manifest.json',
      ].sort());
    });

    it('calles `packer` with privateKey as the 2nd argument', () => {
      assert(packer.calledOnce);
      assert(packer.args[0][1] === undefined);
    });

    it('generates a private key file', () => {
      const privateKey = fs.readFileSync(path.join(path.dirname(pluginDir), `${ID}.ppk`), 'utf8');
      assert(privateKey === PRIVATE_KEY);
    });

    it('generates a plugin file', () => {
      const pluginFile = fs.readFileSync(pluginFilePath);
      assert(PLUGIN_BUFFER.equals(pluginFile));
    });
  });

  context('with ppk', () => {
    let packer;
    beforeEach(() => {
      packer = sinon.stub().returns({
        id: ID,
        privateKey: PRIVATE_KEY,
        plugin: PLUGIN_BUFFER,
      });

      return rimraf(`${outDir}/*.*(ppk|zip)`)
        .then(() => cli(pluginDir, {ppk: ppkPath, packerMock_: packer}));
    });

    it('calles `packer` with privateKey as the 2nd argument', () => {
      assert(packer.calledOnce);
      const ppkFile = fs.readFileSync(ppkPath, 'utf8');
      assert(packer.args[0][1] === ppkFile);
    });

    it('does not generate a private key file', () => {
      const ppkFiles = glob.sync(`${outDir}/*.ppk`);
      assert.deepEqual(ppkFiles, []);
    });
  });
});
