# commitlint 共通設定

kintone プロジェクト向けの commitlint 共通設定。Semantic Commit Messages を強制。

## 使用方法

```javascript
// commitlint.config.cjs
module.exports = require("@kintone/configs/commitlint-config");
```

## コミットメッセージ形式

```
<type>: <subject>

[body]

[footer]
```

### type 一覧

| type       | 説明                         |
| ---------- | ---------------------------- |
| `feat`     | 新機能                       |
| `fix`      | バグ修正                     |
| `docs`     | ドキュメント更新             |
| `style`    | コード整形（動作に影響なし） |
| `refactor` | リファクタリング             |
| `test`     | テスト追加/修正              |
| `chore`    | ビルドプロセスやツールの変更 |

### 例

```
feat: add user authentication

- Implement login/logout functionality
- Add session management

fixes #123
```

## 設定内容

| 設定           | 値                                | 説明                                               |
| -------------- | --------------------------------- | -------------------------------------------------- |
| extends        | `@commitlint/config-conventional` | Conventional Commits 仕様に準拠                    |
| `subject-case` | `[0]`                             | subject の大文字小文字ルールを無効化（日本語対応） |

## 関連ドキュメント

- [ADR-006: commitlint 共通設定](../docs/adr/006-commitlint-settings.md)
