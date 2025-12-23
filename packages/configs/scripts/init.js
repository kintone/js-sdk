#!/usr/bin/env node

import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const cwd = process.cwd();

const files = {
  "eslint.config.js": `import config from "@kintone/configs/eslint-config";

export default config;
`,

  "tsconfig.json": `{
  "extends": "@kintone/configs/tsconfig"
}
`,

  "commitlint.config.cjs": `module.exports = require("@kintone/configs/commitlint-config");
`,

  "renovate.json5": `{
  extends: ["local>kintone/js-sdk:packages/configs/renovate/default.json5"],
}
`,

  "license-manager.config.cjs": `const { isMatchName, createConfig } = require("@cybozu/license-manager");
const {
  allowLicenses,
  allowPackages,
  createOverrideLicense,
  createOverrideLicenseText,
} = require("@kintone/configs/license-manager");

module.exports = createConfig({
  analyze: {
    allowLicenses,
    allowPackages,
  },
  overrideLicense: createOverrideLicense(),
  overrideLicenseText: createOverrideLicenseText(isMatchName),
  packageManager: "pnpm",
});
`,
};

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Usage: npx @kintone/configs init [options] [files...]

Options:
  --help, -h     Show this help
  --force, -f    Overwrite existing files
  --all, -a      Create all config files

Files:
  eslint         eslint.config.js
  tsconfig       tsconfig.json
  commitlint     commitlint.config.cjs
  renovate       renovate.json5
  license        license-manager.config.cjs

Examples:
  npx @kintone/configs init --all
  npx @kintone/configs init eslint tsconfig
  npx @kintone/configs init commitlint --force
`);
  process.exit(0);
}

const force = args.includes("--force") || args.includes("-f");
const all = args.includes("--all") || args.includes("-a");

const fileArgs = args.filter((arg) => !arg.startsWith("-"));

const fileMap = {
  eslint: "eslint.config.js",
  tsconfig: "tsconfig.json",
  commitlint: "commitlint.config.cjs",
  renovate: "renovate.json5",
  license: "license-manager.config.cjs",
};

const targetFiles = all
  ? Object.values(fileMap)
  : fileArgs.map((arg) => fileMap[arg]).filter(Boolean);

if (targetFiles.length === 0) {
  console.error("No files specified. Use --all or specify files.");
  console.error("Run with --help for usage.");
  process.exit(1);
}

for (const filename of targetFiles) {
  const filepath = join(cwd, filename);

  if (existsSync(filepath) && !force) {
    console.log(`⏭️  ${filename} already exists (use --force to overwrite)`);
    continue;
  }

  writeFileSync(filepath, files[filename]);
  console.log(`✅ ${filename} created`);
}
