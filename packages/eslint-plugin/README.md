# @kintone/eslint-plugin

[![npm version](https://badge.fury.io/js/@kintone%2Feslint-plugin.svg)](https://badge.fury.io/js/@kintone%2Feslint-plugin)
![Node.js version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/kintone/js-sdk/main/packages/eslint-plugin/package.json&label=node&query=$.engines.node&colorB=blue)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-yellow.svg)](LICENSE)

> This plugin provides rules for kintone customization and plugin development.

> [!WARNING]
> Experimental: This package is still under early development.

## Usage

```shell
npm i -D @kintone/eslint-plugin
```

```javascript
// eslint.config.mjs
import kintoneESLintPlugin from "@kintone/eslint-plugin";

export default [kintoneESLintPlugin.configs.recommended];
```

## Rules

| Name                                                                         | Description                                                                                                |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [`no-cybozu-data`](docs/rules/no-cybozu-data.md)                             | Prevents access to `cybozu.data`, an internal and unsupported API that may change without notice.          |
| [`no-kintone-internal-selector`](docs/rules/no-kintone-internal-selector.md) | Prevents the use of internal kintone UI class names (e.g., `gaia-argoui-`, `-gaia`, `ocean-`, `kintone-`). |

## For Experimental New Plugin System

See [docs/experimental-new-plugin-system.md](docs/experimental-new-plugin-system.md) for rules supporting plugins with `manifest_version` set to `2`.

## License

[Apache 2.0](LICENSE)
