# TypeScript 共通設定

kintone プロジェクト向けの TypeScript 共通設定。

## 使用方法

```json
{
  "extends": "@kintone/configs/tsconfig"
}
```

## 提供する設定

| 設定                               | 値     | 説明                                   |
| ---------------------------------- | ------ | -------------------------------------- |
| `target`                           | ES2024 | 出力する JavaScript のバージョン       |
| `module`                           | node16 | ESM + CommonJS 両対応                  |
| `moduleResolution`                 | node16 | Node.js のモダンなモジュール解決       |
| `verbatimModuleSyntax`             | true   | import/export をそのまま出力           |
| `erasableSyntaxOnly`               | true   | ランタイムに影響しない TS 構文のみ許可 |
| `esModuleInterop`                  | true   | CommonJS の default import を許可      |
| `forceConsistentCasingInFileNames` | true   | ファイル名の大文字小文字を厳密チェック |
| `strict`                           | true   | 全ての厳密な型チェックを有効化         |
| `skipLibCheck`                     | true   | .d.ts の型チェックをスキップ           |

## カスタマイズ

レガシープロジェクトや特殊な要件がある場合は上書き：

```json
{
  "extends": "@kintone/configs/tsconfig",
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "moduleResolution": "node",
    "verbatimModuleSyntax": false,
    "erasableSyntaxOnly": false
  }
}
```

## 関連ドキュメント

- [ADR-002: TypeScript 共通設定](../docs/adr/002-tsconfig-settings.md)
