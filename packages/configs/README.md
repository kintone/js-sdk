# @kintone/configs

> **Internal Package**: This package is intended for internal use by the kintone development team. It is not intended for public release, and breaking changes may occur without notice.

Shared configurations for kintone-related projects.

## Package Structure

```
packages/configs/
├── eslint/          # ESLint configuration
├── tsconfig/        # TypeScript configuration
├── renovate/        # Renovate configuration
├── license-manager/ # OSS license validation
├── commitlint/      # Commit message validation
└── docs/adr/        # Architecture Decision Records
```

## Usage

### ESLint

```js
// eslint.config.js
import defaultConfig from "@kintone/configs/eslint-config";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...defaultConfig,
  {
    ignores: ["packages"],
  },
];
```

See [eslint/README.md](./eslint/README.md) for details.

### tsconfig

```json
{
  "extends": "@kintone/configs/tsconfig"
}
```

See [tsconfig/README.md](./tsconfig/README.md) for details.

### Renovate

```json5
// renovate.json5
{
  extends: ["local>kintone/js-sdk:packages/configs/renovate/default.json5"],
}
```

See [renovate/README.md](./renovate/README.md) for details.

### license-manager

```js
// license-manager.config.cjs
const { createConfig } = require("@cybozu/license-manager");
const { allowLicenses } = require("@kintone/configs/license-manager");

const config = createConfig({
  analyze: {
    allowLicenses,
    // Project-specific settings
    allowPackages: ["some-package"],
  },
  // Project-specific override
  overrideLicense: (dep) => {
    if (dep.name === "some-package") {
      return "MIT";
    }
    return undefined;
  },
  packageManager: "pnpm",
});

module.exports = config;
```

See [license-manager/README.md](./license-manager/README.md) for details.

### commitlint

```js
// commitlint.config.cjs
module.exports = require("@kintone/configs/commitlint-config");
```

See [commitlint/README.md](./commitlint/README.md) for details.

## Documentation

- [Architecture Decision Records](./docs/adr/README.md)
