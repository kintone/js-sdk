#!/usr/bin/env node

"use strict";

const meow = require("meow");
const packer = require("../dist/cli");

const USAGE = "$ kintone-plugin-packer [options] PLUGIN_DIR";

const flagSpec = {
  ppk: {
    type: "string",
  },
  out: {
    type: "string",
  },
  watch: {
    type: "boolean",
    alias: "w",
  },
};

const cli = meow(
  `
Usage
  ${USAGE}

Options
  --ppk PPK_FILE: Private key file. If omitted, it's generated into '<Plugin ID>.ppk' in the same directory of PLUGIN_DIR.
  --out PLUGIN_FILE: The default is 'plugin.zip' in the same directory of PLUGIN_DIR.
  --watch: Watch PLUGIN_DIR for the changes.
`,
  {
    flags: flagSpec,
  }
);

if (!cli.input[0]) {
  console.error("Error: An argument `PLUGIN_DIR` is required.");
  cli.showHelp();
}

const pluginDir = cli.input[0];
const flags = Object.keys(flagSpec).reduce((prev, cur) => {
  prev[cur] = cli.flags[cur];
  return prev;
}, {});

if (process.env.NODE_ENV === "test") {
  console.log(JSON.stringify({ pluginDir, flags }));
} else {
  packer(pluginDir, flags);
}
