# Renovate 共通設定

kintone プロジェクト向けの Renovate 共通設定。

## 使用方法

```json5
// renovate.json5
{
  $schema: "https://docs.renovatebot.com/renovate-schema.json",
  extends: ["local>kintone/js-sdk:packages/configs/renovate/default.json5"],
}
```

## 提供する設定

| 設定 | 説明 |
|------|------|
| `github>cybozu/renovate-config` | Cybozu 共通の Renovate 設定を継承 |
| `:prConcurrentLimitNone` | 同時 PR 数の制限を解除 |
| `git-submodules: enabled` | Git サブモジュールの自動更新を有効化 |
| `semanticCommitType: "chore"` | パッケージ更新のコミットを `chore:` に統一 |
| devDependencies automerge | 開発依存の minor 更新を自動マージ |
| Third party actions pinDigests | サードパーティ Actions を SHA でピン |

## サードパーティ Actions の digest ピン

```yaml
# ❌ タグ指定: 後から書き換え可能（セキュリティリスク）
- uses: some-org/action@v4

# ✅ digest 指定: 特定コミットに固定（改変不可能）
- uses: some-org/action@a1b2c3d4e5f6...
```

- `actions/*`, `cybozu/*`: 信頼できるためピン不要
- その他: サードパーティ → digest でピン

## カスタマイズ

プロジェクト固有の設定を追加：

```json5
{
  extends: ["local>kintone/js-sdk:packages/configs/renovate/default.json5"],
  ignorePaths: ["**/test/**"],
}
```

## 関連ドキュメント

- [ADR-004: Renovate 共通設定](../docs/adr/004-renovate-settings.md)
