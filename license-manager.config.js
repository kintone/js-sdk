const { createConfig } = require("@cybozu/license-manager");
const { allowLicenses } = require("@kintone/configs/license-manager");

const config = createConfig({
  analyze: {
    allowLicenses,
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
    if(dep.name === "source-map") {
      return "BSD-3-Clause"
    }
    return undefined;
  },
  packageManager: "pnpm",
});

module.exports = config;
