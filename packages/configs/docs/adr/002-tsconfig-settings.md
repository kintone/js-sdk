# ADR-002: TypeScript 共通設定

## ステータス

提案中

## コンテキスト

各プロジェクトの tsconfig.json を調査した結果、以下の状況が判明：

| プロジェクト | target | module | moduleResolution |
|-------------|--------|--------|------------------|
| cli-kintone | es2018 | commonjs | node |
| js-sdk | es2015 | commonjs | (未指定) |
| mcp-server | ES2024 | node16 | node16 |
| plugin-sandbox | ES2024 | node16 | node16 |

mcp-server と plugin-sandbox はモダンな設定を使用しているが、cli-kintone と js-sdk はレガシーな CommonJS 設定を使用している。

## 決定

### モダン設定を共通設定として提供

```json
{
  "compilerOptions": {
    "target": "ES2024",
    "module": "node16",
    "moduleResolution": "node16",
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

### 各設定の意味

| 設定 | 意味 |
|------|------|
| `target: ES2024` | 出力するJavaScriptのバージョン |
| `module: node16` | ESM + CommonJS 両対応のモジュールシステム |
| `moduleResolution: node16` | Node.js のモダンなモジュール解決戦略 |
| `verbatimModuleSyntax` | import/export をそのまま出力（型のみのimportは削除） |
| `erasableSyntaxOnly` | ランタイムに影響しないTS構文のみ許可 |
| `esModuleInterop` | CommonJS モジュールの default import を許可 |
| `forceConsistentCasingInFileNames` | ファイル名の大文字小文字を厳密にチェック |
| `strict` | 全ての厳密な型チェックを有効化 |
| `skipLibCheck` | .d.ts ファイルの型チェックをスキップ（ビルド高速化） |

### レガシープロジェクトの対応

cli-kintone と js-sdk は各プロジェクトで上書きする：

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

## 結果

- 新規プロジェクトはモダンな設定をデフォルトで使用できる
- レガシープロジェクトは移行準備ができるまで上書きで対応
- 将来的にはすべてのプロジェクトをモダン設定に統一する方向
