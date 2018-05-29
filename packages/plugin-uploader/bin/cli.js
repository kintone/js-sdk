#!/usr/bin/env node

'use strict';

const meow = require('meow');
const { run } = require('../dist/index');
const { inquireParams } = require('../dist/params');

const {
  HTTP_PROXY,
  HTTPS_PROXY,
  KINTONE_DOMAIN,
  KINTONE_USERNAME,
  KINTONE_PASSWORD
} = process.env;

const cli = meow(
  `
  Usage
    $ kintone-plugin-uploader <pluginPath>
  Options
    --domain Domain of your kintone
    --username Login username
    --password User's password
    --proxy Proxy server
    --watch Watch the changes of plugin zip and re-run

    You can set the values through environment variables
    domain: KINTONE_DOMAIN
    username: KINTONE_USERNAME
    password: KINTONE_PASSWORD
    proxy: HTTPS_PROXY or HTTP_PROXY
`,
  {
    flags: {
      domain: {
        type: 'string',
        default: KINTONE_DOMAIN
      },
      username: {
        type: 'string',
        default: KINTONE_USERNAME
      },
      password: {
        type: 'string',
        default: KINTONE_PASSWORD
      },
      proxy: {
        type: 'string',
        default: HTTPS_PROXY || HTTP_PROXY
      },
      watch: {
        type: 'boolean',
        default: false
      }
    }
  }
);

const pluginPath = cli.input[0];
const { username, password, domain, proxy, watch } = cli.flags;
const options = proxy ? { watch, proxyServer: proxy } : { watch };

if (!pluginPath) {
  console.error('Please specify the path of kintone plugin zip');
  cli.showHelp();
  process.exit(1);
}

inquireParams({username, password, domain}).then(({username, password, domain}) =>
  run(domain, username, password, pluginPath, options)
);
