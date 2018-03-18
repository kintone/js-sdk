'use strict';

const assert = require('assert');
const path = require('path');
const execa = require('execa');
const pkg = require('../package.json');

describe('bin', () => {
  it('should output version with --version', () =>
    exec('--version').then(result => {
      assert(result.stdout === pkg.version);
    }));

  it('should fail without args', () =>
    exec().then(
      () => {
        assert.fail('should be rejected');
      },
      result => {
        assert(/An argument `PLUGIN_DIR` is required/.test(result.stderr));
      }
    ));

  it('should recieve 1st arg as PLUGIN_DIR', () =>
    exec('foo').then(result => {
      assert.deepEqual(JSON.parse(result.stdout), {pluginDir: 'foo', flags: {watch: false}});
    }));

  it('should recieve --ppk', () =>
    exec('foo', '--ppk', 'bar').then(result => {
      assert.deepEqual(JSON.parse(result.stdout), {
        pluginDir: 'foo',
        flags: {watch: false, ppk: 'bar'},
      });
    }));

  it('should recieve --out', () =>
    exec('foo', '--out', 'bar').then(result => {
      assert.deepEqual(JSON.parse(result.stdout), {
        pluginDir: 'foo',
        flags: {watch: false, out: 'bar'},
      });
    }));

  it('should recieve --watch', () =>
    exec('foo', '--watch').then(result => {
      assert.deepEqual(JSON.parse(result.stdout), {pluginDir: 'foo', flags: {watch: true}});
    }));

  it('should recieve -w as an alias of --watch', () =>
    exec('foo', '-w').then(result => {
      assert.deepEqual(JSON.parse(result.stdout), {pluginDir: 'foo', flags: {watch: true}});
    }));

  it('should filter unexpected option', () =>
    exec('foo', '--bar').then(result => {
      assert.deepEqual(JSON.parse(result.stdout), {pluginDir: 'foo', flags: {watch: false}});
    }));
});

function exec(...args) {
  const binPath = path.resolve(__dirname, '../bin/cli.js');
  const env = Object.assign({}, process.env, {NODE_ENV: 'test'});
  return execa(binPath, args, {env});
}
