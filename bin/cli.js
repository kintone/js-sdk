#!/usr/bin/env node

'use strict';

const meow = require('meow');
const run = require('../dist/src/index');

const cli = meow(
  `
  Usage
    $ create-kintone-plugin <directory>
  Options
    --lang Using language (en or ja)
`,
  {
    flags: {
      lang: {
        type: 'string',
        default: 'en'
      }
    }
  }
);

const directory = cli.input[0];
const { lang } = cli.flags;

if (!directory) {
  console.error('Please specify the output directory');
  cli.showHelp();
}

if (lang !== 'ja' && lang !== 'en') {
  console.error('--lang option only supports en or ja');
  cli.showHelp();
}

run(directory, lang);
