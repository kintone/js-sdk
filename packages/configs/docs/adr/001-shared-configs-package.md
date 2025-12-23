# ADR-001: 共通設定パッケージ @kintone/configs の設計

## ステータス

提案

## コンテキスト

🧩チームには複数のプロジェクトが存在する：

- cli-kintone
- js-sdk
- mcp-server
- plugin-sandbox
- ...

これらのプロジェクトで ESLint、TypeScript、Renovate 等の設定が重複しており、以下の問題があった：

1. 設定の不一致（プロジェクトごとに微妙に異なる設定）
2. メンテナンスコスト（同じ変更を複数箇所に適用する必要）
3. ベストプラクティスの適用漏れ

## 決定

`@kintone/configs` パッケージを作成し、共通設定を一元管理する。

### パッケージ構成

```
packages/configs/
├── eslint/
│   └── config.js
├── tsconfig/
│   └── tsconfig.json
├── renovate/
│   └── default.json5
├── license-manager/
│   └── base.cjs
├── commitlint/
│   └── config.cjs
├── index.js
├── package.json
└── README.md
```

### エクスポート

```json
{
  "exports": {
    "./eslint-config": "./eslint/config.js",
    "./tsconfig": "./tsconfig/tsconfig.json",
    "./renovate-config": "./renovate/default.json5",
    "./license-manager": "./license-manager/base.cjs",
    "./commitlint-config": "./commitlint/config.cjs"
  }
}
```

## 結果

### メリット

- 設定の一元管理によるメンテナンス性向上
- プロジェクト間での一貫性確保
- 新規プロジェクト立ち上げ時の設定コスト削減

### デメリット

- 共通設定の変更が全プロジェクトに影響する
- プロジェクト固有の要件は各プロジェクトで上書きが必要
