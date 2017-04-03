#!/usr/bin/env node

'use strict';

const meow = require('meow');
const packer = require('../src/cli');
const USAGE = '$ kintone-plugin-packer [options] PLUGIN_DIR';

const cli = meow(`
Usage
  ${USAGE}

Options
  --ppk PPK_FILE: Private key file. If omitted, it's generated into '<Plugin ID>.ppk' in the same directory of PLUGIN_DIR.
  --out PLUGIN_FILE: The default is 'plugin.zip' in the same directory of PLUGIN_DIR.
`, {
  string: ['ppk', 'out'],
});

if (!cli.input[0]) {
  throw new Error('An argument `PLUGIN_DIR` is required.');
}

const flags = cli.flags;
packer(cli.input[0], {ppk: flags.ppk, out: flags.out});
