# ADR-005: license-manager 共通設定

## ステータス

提案中

## コンテキスト

各プロジェクトで `@cybozu/license-manager` を使用してOSSライセンスの検証を行っている。`allowLicenses` のリストは大部分が共通しているが、プロジェクト固有の `allowPackages` や `overrideLicense` が存在する。

### 調査結果

全プロジェクトで共通して許可されているライセンス：

- MIT, MIT-0, Apache-2.0
- BSD-2-Clause, BSD-3-Clause
- ISC, 0BSD
- Python-2.0, MPL-2.0
- CC0-1.0, CC-BY-3.0, CC-BY-4.0
- BlueOak-1.0.0, Unlicense
- 各種複合ライセンス

## 決定

### 共通設定（allowLicenses のベースリスト）

```javascript
// license-manager/base.cjs
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

module.exports = { allowLicenses };
```

### 使用方法

```javascript
// license-manager.config.cjs
const { createConfig } = require("@cybozu/license-manager");
const { allowLicenses } = require("@kintone/configs/license-manager");

const config = createConfig({
  analyze: {
    allowLicenses,
    // プロジェクト固有の許可パッケージ
    allowPackages: ["some-specific-package"],
  },
  // プロジェクト固有のオーバーライド
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

## 結果

- 許可ライセンスリストの一元管理
- プロジェクト固有の設定は各プロジェクトで拡張可能
- 新しいライセンスを許可する場合、共通設定を更新すれば全プロジェクトに反映
