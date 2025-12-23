# @kintone/configs

kintone プロジェクト向けの共通設定パッケージ。

## パッケージ構成

```
packages/configs/
├── eslint/          # ESLint 設定
├── tsconfig/        # TypeScript 設定
├── renovate/        # Renovate 設定
├── license-manager/ # OSS ライセンス検証設定
├── commitlint/      # コミットメッセージ検証設定
└── docs/adr/        # パッケージ全体の設計決定記録
```

## 設定の使用方法

### ESLint

```javascript
import defaultConfig from "@kintone/configs/eslint-config";
export default [...defaultConfig];
```

### TypeScript

```json
{ "extends": "@kintone/configs/tsconfig" }
```

### Renovate

```json5
{ extends: ["local>kintone/js-sdk:packages/configs/renovate/default.json5"] }
```

### license-manager

```javascript
const { allowLicenses } = require("@kintone/configs/license-manager");
```

### commitlint

```javascript
module.exports = require("@kintone/configs/commitlint-config");
```

## 設定のカスタマイズ

各設定は extends/import 後に上書き可能。詳細は各設定ディレクトリの README.md を参照：

- [eslint/README.md](./eslint/README.md)
- [tsconfig/README.md](./tsconfig/README.md)
- [renovate/README.md](./renovate/README.md)
- [license-manager/README.md](./license-manager/README.md)
- [commitlint/README.md](./commitlint/README.md)

## 設計決定

各設定の設計理由は ADR（Architecture Decision Records）に記録：

- パッケージ全体: [docs/adr/](./docs/adr/README.md)
- 各設定: `<設定名>/docs/adr/` ディレクトリ
