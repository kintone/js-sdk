# license-manager 共通設定

kintone プロジェクト向けの OSS ライセンス検証設定。

## 使用方法

```javascript
// license-manager.config.js
const { createConfig } = require("@cybozu/license-manager");
const { allowLicenses } = require("@kintone/configs/license-manager");

const config = createConfig({
  analyze: {
    allowLicenses,
  },
  packageManager: "pnpm",
});

module.exports = config;
```

## 許可ライセンス一覧

| カテゴリ | ライセンス |
|----------|-----------|
| Permissive | MIT, MIT-0, Apache-2.0, ISC, 0BSD |
| BSD系 | BSD-2-Clause, BSD-3-Clause |
| その他 | Python-2.0, MPL-2.0, BlueOak-1.0.0, Unlicense |
| Creative Commons | CC0-1.0, CC-BY-3.0, CC-BY-4.0 |
| 複合 | (MIT OR Apache-2.0), (MIT OR CC0-1.0) 等 |

## カスタマイズ

プロジェクト固有のパッケージを許可する場合：

```javascript
const { allowLicenses } = require("@kintone/configs/license-manager");

const config = createConfig({
  analyze: {
    allowLicenses,
    allowPackages: ["some-specific-package"],
  },
  overrideLicense: (dep) => {
    if (dep.name === "some-package") {
      return "MIT";
    }
    return undefined;
  },
  packageManager: "pnpm",
});
```

## 関連ドキュメント

- [ADR-005: license-manager 共通設定](../docs/adr/005-license-manager-settings.md)
