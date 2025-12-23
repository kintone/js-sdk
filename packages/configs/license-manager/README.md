# license-manager 共通設定

kintone プロジェクト向けの OSS ライセンス検証設定。

## エクスポート

| 名前 | 説明 |
|------|------|
| `allowLicenses` | 許可ライセンス一覧 |
| `allowPackages` | ライセンスに関係なく許可するパッケージ一覧 |
| `overrideLicenses` | ライセンス上書き定義（パッケージ名→ライセンス） |
| `overrideLicenseTexts` | ライセンステキスト上書き定義 |
| `createOverrideLicense` | overrideLicense関数を生成するヘルパー |
| `createOverrideLicenseText` | overrideLicenseText関数を生成するヘルパー |

## 基本的な使用方法

```javascript
const { isMatchName, createConfig } = require("@cybozu/license-manager");
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
```

## プロジェクト固有の設定を追加

```javascript
const { isMatchName, createConfig } = require("@cybozu/license-manager");
const {
  allowLicenses,
  allowPackages,
  createOverrideLicense,
  createOverrideLicenseText,
} = require("@kintone/configs/license-manager");

module.exports = createConfig({
  analyze: {
    allowLicenses,
    allowPackages: [
      ...allowPackages,
      // プロジェクト固有
      "some-special-package",
    ],
  },
  overrideLicense: createOverrideLicense({
    // プロジェクト固有の上書き
    "my-package": "MIT",
  }),
  overrideLicenseText: createOverrideLicenseText(isMatchName, {
    // プロジェクト固有の上書き
    "my-package": {
      licensePageUrl: "https://example.com/LICENSE",
    },
  }),
  packageManager: "pnpm",
});
```

## 許可ライセンス一覧

| カテゴリ | ライセンス |
|----------|-----------|
| Permissive | MIT, MIT-0, Apache-2.0, ISC, 0BSD |
| BSD系 | BSD-2-Clause, BSD-3-Clause |
| その他 | Python-2.0, MPL-2.0, BlueOak-1.0.0, Unlicense |
| Creative Commons | CC0-1.0, CC-BY-3.0, CC-BY-4.0 |
| 複合 | (MIT OR Apache-2.0), (MIT OR CC0-1.0) 等 |

## 関連ドキュメント

- [ADR-005: license-manager 共通設定](../docs/adr/005-license-manager-settings.md)
