# For Experimental New Plugin System

These rules are for plugins with `manifest_version` set to `2` in the manifest file.

To use these rules, add `kintoneESLintPlugin.configs.manifestV2` to your ESLint config.

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
  kintoneESLintPlugin.configs.manifestV2,
];
```

## Rules

| Name                                                  | Description                                                              |
| ----------------------------------------------------- | ------------------------------------------------------------------------ |
| [`only-allowed-js-api`](rules/only-allowed-js-api.md) | Only allow the kintone JS APIs listed in permissions.js_api in manifest. |

## Options

These rules require the following options configured via [shared settings](https://eslint.org/docs/latest/use/configure/configuration-files#configuring-shared-settings).

| Name               | Type     | Default           | Description                   |
| ------------------ | -------- | ----------------- | ----------------------------- |
| `manifest`         | `object` | -                 | The manifest object directly. |
| `manifestFilePath` | `string` | `"manifest.json"` | Path to the manifest file.    |
