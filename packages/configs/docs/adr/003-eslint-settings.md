# ADR-003: ESLint 共通設定

## ステータス

提案中

## コンテキスト

各プロジェクトの ESLint 設定を調査し、共通化できるルールを特定した。

### 調査結果

| ルール | cli-kintone | js-sdk | mcp-server | plugin-sandbox |
|--------|-------------|--------|------------|----------------|
| curly: all | ✅ | ✅ | ❌ | ❌ |
| func-style | ✅ | ✅ | ❌ | ❌ |
| consistent-type-imports | ✅ | ✅ | ✅ | ✅ |
| no-empty-object-type: off | ✅ | ✅ | ❌ | ❌ |
| no-wrapper-object-types: off | ✅ | ✅ | ❌ | ❌ |
| no-unused-vars (カスタム) | ✅ | ❌ | ❌ | ❌ |
| n/no-missing-import: off | ✅ | ✅ | カスタム | ❌ |
| eslint-plugin-package-json | ❌ | ✅ | ✅ | ✅ |

## 決定

### 採用するルール

```javascript
{
  rules: {
    // if/for/while 等で常に {} を強制（バグ防止）
    curly: ["error", "all"],

    // import type の使用を強制（バンドル最適化）
    "@typescript-eslint/consistent-type-imports": "error",

    // 未使用変数を警告（_ プレフィックスは許可）
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
      },
    ],

    // TypeScript で冗長なため無効化
    "n/no-missing-import": "off",
  },
}
```

### 採用しないルール

| ルール | 理由 |
|--------|------|
| `func-style` | 好みの問題。強制しない |
| `no-empty-object-type: off` | レガシー対応。本来は error 推奨 |
| `no-wrapper-object-types: off` | レガシー対応。本来は error 推奨 |

### 各ルールの意味

| ルール | 意味 | 2025年ベストプラクティス |
|--------|------|-------------------------|
| `curly: ["error", "all"]` | if/for/while等で常に`{}`を強制。省略によるバグを防止 | ✅ 推奨 |
| `consistent-type-imports` | 型のみのimportに`import type`を強制。バンドル最適化 | ✅ 推奨 |
| `no-unused-vars` | 未使用変数を検出。`_`プレフィックスで意図的な未使用を明示 | ✅ 推奨 |
| `n/no-missing-import: off` | import先ファイル存在チェック。TypeScriptで冗長 | ✅ off推奨 |

### プラグイン

- `eslint-plugin-package-json`: package.json の構文・順序チェック（monorepo で有用）

### globals 設定

```javascript
// CommonJS ファイル
{ files: ["*.cjs", "*.cts"], languageOptions: { globals: globals.node } }

// ESM ファイル
{ files: ["*.js", "*.ts", "*.mjs", "*.mts"], languageOptions: { globals: globals.nodeBuiltin } }
```

## 結果

- ベストプラクティスに基づいた統一された ESLint 設定
- プロジェクト固有の設定は各プロジェクトで上書き可能
- レガシーコード対応の `off` 設定は共通設定に含めず、必要なプロジェクトで個別に設定
