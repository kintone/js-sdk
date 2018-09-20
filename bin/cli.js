#!/usr/bin/env node

const osLocale = require('os-locale');
const meow = require('meow');
const { run } = require('../dist/src/index');
const { inquireParams } = require('../dist/src/params');
const { getDefaultLang } = require('../dist/src/lang');
const { getMessage } = require('../dist/src/messages');

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
    $ kintone-customize-uploader <manifestFile>
  Options
    --domain Domain of your kintone
    --username Login username
    --password User's password
    --proxy Proxy server
    --watch Watch the changes of customize files and re-run
    --lang Using language (en or ja)
    --guest-space-id Guest space ID for uploading files
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
      },
      lang: {
        type: 'string',
        default: getDefaultLang(osLocale.sync())
      },
      guestSpaceId: {
        type: 'number',
        default: 0
      },
    }
  }
);

const manifestFile = cli.input[0];
const {
  username,
  password,
  domain,
  proxy,
  watch,
  lang,
  guestSpaceId
} = cli.flags;

const options = proxy ? { watch, lang, proxy } : { watch, lang };
if (guestSpaceId) {
  options.guestSpaceId = guestSpaceId;
}

if (!manifestFile) {
  console.error(getMessage(lang, 'E_requiredManifestFile'));
  cli.showHelp();
  process.exit(1);
}

inquireParams({ username, password, domain, lang })
  .then(({ username, password, domain }) => (
    run(domain, username, password, manifestFile, options)
  ))
  .catch(error => console.log(error.message));
  ;
