# ADR-004: Renovate 共通設定

## ステータス

提案中

## コンテキスト

各プロジェクトの Renovate 設定を調査した結果：

| 設定                           | cli-kintone | js-sdk | mcp-server | plugin-sandbox |
| ------------------------------ | ----------- | ------ | ---------- | -------------- |
| cybozu/renovate-config         | ✅          | ✅     | ✅         | ✅             |
| prConcurrentLimitNone          | ✅          | ✅     | ✅         | ✅             |
| semanticCommitType: chore      | ✅          | ✅     | ❌         | ❌             |
| devDeps minor automerge        | ✅          | ✅     | ✅         | ❌             |
| Third party actions pinDigests | ✅          | ✅     | ❌         | ❌             |

## 決定

### 共通設定

```json5
{
  extends: ["github>cybozu/renovate-config", ":prConcurrentLimitNone"],
  "git-submodules": {
    enabled: true,
  },
  npm: {
    packageRules: [
      {
        // パッケージ更新のコミットを chore: に統一
        matchPackagePatterns: ["*"],
        semanticCommitType: "chore",
      },
      {
        // devDependencies の minor 更新を自動マージ
        matchPackagePatterns: ["*"],
        matchDepTypes: ["devDependencies"],
        matchUpdateTypes: ["minor"],
        automerge: true,
      },
    ],
  },
  packageRules: [
    {
      // サードパーティ Actions を digest でピン（セキュリティ）
      matchDepTypes: ["action"],
      excludePackagePrefixes: ["actions/", "cybozu/"],
      pinDigests: true,
    },
  ],
}
```

### 各設定の意味

| 設定                            | 意味                                                          |
| ------------------------------- | ------------------------------------------------------------- |
| `github>cybozu/renovate-config` | Cybozu 共通の Renovate 設定を継承                             |
| `:prConcurrentLimitNone`        | 同時 PR 数の制限を解除                                        |
| `git-submodules: enabled`       | Git サブモジュールの自動更新を有効化                          |
| `semanticCommitType: "chore"`   | パッケージ更新のコミットを `chore:` に統一（Semantic Commit） |
| devDependencies automerge       | 開発依存の minor 更新は安全なため自動マージ                   |
| Third party actions pinDigests  | サードパーティ Actions をコミット SHA でピン                  |

### サードパーティ Actions の digest ピンについて

```yaml
# ❌ タグ指定: 後から書き換え可能（セキュリティリスク）
- uses: some-org/action@v4

# ✅ digest 指定: 特定コミットに固定（改変不可能）
- uses: some-org/action@a1b2c3d4e5f6...
```

- `actions/*`: GitHub 公式（信頼できる）→ ピン不要
- `cybozu/*`: 自社製（信頼できる）→ ピン不要
- その他: サードパーティ → digest でピン

### プロジェクト固有の設定

以下はプロジェクト固有のため共通設定に含めない：

| 設定                    | 使用プロジェクト |
| ----------------------- | ---------------- |
| Node.js バージョン固定  | mcp-server       |
| Docker digest automerge | mcp-server       |
| ignorePaths             | js-sdk           |

## 結果

- Semantic Commit Messages の統一
- 安全な自動マージによる運用負荷軽減
- サプライチェーン攻撃対策の強化
