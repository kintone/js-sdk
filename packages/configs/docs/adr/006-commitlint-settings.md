# ADR-006: commitlint 共通設定

## ステータス

提案中

## コンテキスト

Semantic Commit Messages を使用してコミットメッセージの形式を統一している：

- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメント更新
- `style:` コード整形
- `refactor:` リファクタリング
- `test:` テスト追加/修正
- `chore:` ビルドプロセスやツールの変更

現状、commitlint は mcp-server でのみ設定されている。

## 決定

### 共通設定

```javascript
// commitlint/config.cjs
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [0],  // subject の大文字小文字を強制しない
  },
};
```

### 設定の意味

| 設定 | 意味 |
|------|------|
| `@commitlint/config-conventional` | Conventional Commits 仕様に準拠 |
| `subject-case: [0]` | subject の大文字小文字ルールを無効化（日本語対応） |

### 使用方法

```javascript
// commitlint.config.cjs
module.exports = require("@kintone/configs/commitlint-config");
```

## 結果

- 全プロジェクトで Semantic Commit Messages を統一
- CI でコミットメッセージの形式をチェック可能
- 自動 CHANGELOG 生成との連携が容易に
