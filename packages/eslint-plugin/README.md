# @kintone/eslint-plugin

[![npm version](https://badge.fury.io/js/@kintone%2Feslint-plugin.svg)](https://badge.fury.io/js/@kintone%2Feslint-plugin)
![Node.js version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/kintone/js-sdk/main/packages/eslint-plugin/package.json&label=node&query=$.engines.node&colorB=blue)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-yellow.svg)](LICENSE)

> This plugin provide rules for kintone plugin development.

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

By default, this plugin refers `manifest.json` of current directory.
You can update this behavior by `manifestFilePath` in [shared settings](https://eslint.org/docs/latest/use/configure/configuration-files#configuring-shared-settings).

```javascript
// eslint.config.mjs
import kintoneESLintPlugin from "@kintone/eslint-plugin";

export default [
  {
    settings: {
      "@kintone/eslint-plugin": { manifestFilePath: "path/to/manifest.json" },
    },
  },
  kintoneESLintPlugin.configs.recommended,
];
```

## Rules

| Name                                                       | Description                                                              |
| ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| [`only-allowed-js-api`](docs/rules/only-allowed-js-api.md) | Only allow the kintone JS APIs listed in permissions.js_api in manifest. |

## License

[Apache 2.0](LICENSE)
