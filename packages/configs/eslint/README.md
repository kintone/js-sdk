# ESLint 共通設定

kintone プロジェクト向けの ESLint 共通設定。

## 使用方法

```javascript
// eslint.config.mjs
import defaultConfig from "@kintone/configs/eslint-config";

export default [...defaultConfig];
```

## 提供するルール

| ルール | 説明 |
|--------|------|
| `curly: ["error", "all"]` | if/for/while 等で常に `{}` を強制 |
| `@typescript-eslint/consistent-type-imports` | 型のみの import に `import type` を強制 |
| `@typescript-eslint/no-unused-vars` | 未使用変数を警告（`_` プレフィックスは許可） |
| `n/no-missing-import: off` | TypeScript で冗長なため無効化 |

## カスタマイズ

プロジェクト固有のルールを追加する場合：

```javascript
import defaultConfig from "@kintone/configs/eslint-config";

export default [
  ...defaultConfig,
  {
    rules: {
      // プロジェクト固有のルール
      "no-console": "warn",
    },
  },
];
```

## 関連ドキュメント

- [ADR-003: ESLint 共通設定](../docs/adr/003-eslint-settings.md)
