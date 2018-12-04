#!/usr/bin/env node

const osLocale = require('os-locale');
const meow = require('meow');
const { run } = require('../dist/src/index');
const { runImport } = require('../dist/src/import');
const { inquireParams } = require('../dist/src/params');
const { getDefaultLang } = require('../dist/src/lang');
const { getMessage } = require('../dist/src/messages');

const {
  HTTP_PROXY,
  HTTPS_PROXY,
  KINTONE_DOMAIN,
  KINTONE_USERNAME,
  KINTONE_PASSWORD,
  KINTONE_BASIC_AUTH_USERNAME,
  KINTONE_BASIC_AUTH_PASSWORD
} = process.env;
const cli = meow(
  `
  Usage
    $ kintone-customize-uploader <manifestFile>
  Options
    --domain Domain of your kintone
    --username Login username
    --password User's password
    --basic-auth-username Basic Authentication username
    --basic-auth-password Basic Authentication password
    --proxy Proxy server
    --watch Watch the changes of customize files and re-run
    --dest-dir -d option for subcommand import. 
                  this option stands for output directory
                  default value is dest/
    --lang Using language (en or ja)
    --guest-space-id Guest space ID for uploading files

   SubCommands
    import generate customize-manifest.json and 
           download js/css files from existing app customization  
    
    You can set the values through environment variables
    domain: KINTONE_DOMAIN
    username: KINTONE_USERNAME
    password: KINTONE_PASSWORD
    basic-auth-username: KINTONE_BASIC_AUTH_USERNAME
    basic-auth-password: KINTONE_BASIC_AUTH_PASSWORD
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
      basicAuthUsername: {
        type: 'string',
        default: KINTONE_BASIC_AUTH_USERNAME
      },
      basicAuthPassword: {
        type: 'string',
        default: KINTONE_BASIC_AUTH_PASSWORD
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
      // Optional option for import subcommand
      destDir: {
        type: 'string',
        default: 'dest',
        alias: 'd'
      }
    }
  }
);

const subCommands = ["import"];
const hasSubCommand = subCommands.indexOf(cli.input[0]) >= 0;
const subCommand = hasSubCommand ? cli.input[0] : null;
const isImportCommand = subCommand === "import";

const manifestFile =  hasSubCommand ? cli.input[1] : cli.input[0];

const {
  username,
  password,
  basicAuthUsername,
  basicAuthPassword,
  domain,
  proxy,
  watch,
  lang,
  guestSpaceId,
  destDir,
} = cli.flags;

const options = proxy ? { watch, lang, proxy } : { watch, lang };
if (guestSpaceId) {
  options.guestSpaceId = guestSpaceId;
}

if(isImportCommand) {
  options.destDir = destDir;
}

if (!manifestFile) {
  console.error(getMessage(lang, 'E_requiredManifestFile'));
  cli.showHelp();
  process.exit(1);
}

inquireParams({ username, password, domain, lang })
  .then(({ username, password, domain }) => {
    if(isImportCommand) {
      runImport(domain, username, password, basicAuthUsername, basicAuthPassword, manifestFile, options)
    } else {
      run(domain, username, password, basicAuthUsername, basicAuthPassword, manifestFile, options)
    }
  })
  .catch(error => console.log(error.message));

