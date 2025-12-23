const allowLicenses = [
  "MIT",
  "MIT-0",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "BSD-3-Clause OR MIT",
  "ISC",
  "0BSD",
  "Python-2.0",
  "MPL-2.0",
  "CC0-1.0",
  "CC-BY-3.0",
  "CC-BY-4.0",
  "(MIT OR Apache-2.0)",
  "(MIT OR CC0-1.0)",
  "(MIT OR WTFPL)",
  "(WTFPL OR MIT)",
  "(MIT AND Zlib)",
  "(MIT AND BSD-3-Clause)",
  "(MIT AND CC-BY-3.0)",
  "(BSD-2-Clause OR MIT OR Apache-2.0)",
  "(BSD-3-Clause OR GPL-2.0)",
  "BlueOak-1.0.0",
  "Unlicense",
];

const allowPackages = [
  // https://github.com/npm/cli/blob/latest/LICENSE
  "npm",
];

const overrideLicenses = {
  // https://github.com/felixge/node-require-like/blob/master/License
  "require-like": "MIT",
  // https://github.com/mafintosh/browserify-fs?tab=readme-ov-file#license
  "browserify-fs": "MIT",
  // https://github.com/mafintosh/fwd-stream?tab=readme-ov-file#license
  "fwd-stream": "MIT",
  // https://github.com/dominictarr/level-hooks/blob/master/LICENSE
  "level-hooks": "MIT",
  // https://www.npmjs.com/package/@braidai/lang?activeTab=code
  "@braidai/lang": "MIT",
  // https://www.npmjs.com/package/source-map
  "source-map": "BSD-3-Clause",
};

const overrideLicenseTexts = {
  "https-proxy-agent": {
    licensePageUrl:
      "https://raw.githubusercontent.com/TooTallNate/proxy-agents/main/packages/https-proxy-agent/LICENSE",
  },
  "agent-base": {
    licensePageUrl:
      "https://raw.githubusercontent.com/TooTallNate/proxy-agents/main/packages/agent-base/LICENSE",
  },
  through: {
    licensePageUrl:
      "https://raw.githubusercontent.com/dominictarr/through/master/LICENSE.MIT",
  },
  "node-rsa": {
    licenseText: "See https://github.com/rzcoder/node-rsa#license",
  },
  "undici-types": {
    licensePageUrl:
      "https://raw.githubusercontent.com/nodejs/undici/main/LICENSE",
  },
  "@inquirer/ansi": {
    licensePageUrl:
      "https://raw.githubusercontent.com/SBoudrias/Inquirer.js/main/LICENSE",
  },
  eastasianwidth: {
    licensePageUrl:
      "https://raw.githubusercontent.com/komagata/eastasianwidth/master/MIT-LICENSE.txt",
  },
  "@tokenizer/token": {
    licenseText: "See https://github.com/Borewit/tokenizer-token#licence",
  },
};

const createOverrideLicense = (additionalOverrides = {}) => {
  const merged = { ...overrideLicenses, ...additionalOverrides };
  return (dep) => merged[dep.name];
};

const createOverrideLicenseText = (isMatchName, additionalOverrides = {}) => {
  const merged = { ...overrideLicenseTexts, ...additionalOverrides };
  return (dep) => {
    for (const packageName of Object.keys(merged)) {
      if (isMatchName(dep, packageName)) {
        return merged[packageName];
      }
    }
    return undefined;
  };
};

module.exports = {
  allowLicenses,
  allowPackages,
  overrideLicenses,
  overrideLicenseTexts,
  createOverrideLicense,
  createOverrideLicenseText,
};
