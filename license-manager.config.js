const { createConfig } = require("@cybozu/license-manager");

const config = createConfig({
  analyze: {
    allowLicenses: [
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
      "(MIT OR CC0-1.0)",
      "(MIT AND Zlib)",
      "(MIT AND BSD-3-Clause)",
      "(MIT AND CC-BY-3.0)",
      "BlueOak-1.0.0",
      "(BSD-3-Clause OR GPL-2.0)",
      "Unlicense",
    ],
    allowPackages: [
      // https://github.com/npm/cli/blob/latest/LICENSE
      "npm",
      "indexof",
    ],
  },
  overrideLicense: (dep) => {
    // https://github.com/mafintosh/browserify-fs?tab=readme-ov-file#license
    if (dep.name === "browserify-fs") {
      return "MIT";
    }
    // https://github.com/mafintosh/fwd-stream?tab=readme-ov-file#license
    if (dep.name === "fwd-stream") {
      return "MIT";
    }
    // https://github.com/dominictarr/level-hooks/blob/master/LICENSE
    if (dep.name === "level-hooks") {
      return "MIT";
    }
    // https://www.npmjs.com/package/@braidai/lang?activeTab=code
    if (dep.name === "@braidai/lang") {
      return "MIT";
    }
    // https://www.npmjs.com/package/source-map
    if (dep.name === "source-map") {
      return "BSD-3-Clause";
    }
    return undefined;
  },
  packageManager: "pnpm",
});

module.exports = config;
