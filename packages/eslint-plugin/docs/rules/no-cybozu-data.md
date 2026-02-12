# Disallow access to the kintone internal API (`no-cybozu-data`)

Detects access to the internal API `cybozu.data`.
Covers patterns like `cybozu.data`, `cybozu["data"]`, `cybozu?.data`, etc.

#### ❌Incorrect

```typescript
const foo = cybozu.data;
```

```typescript
const foo = cybozu.data.abc;
```

```typescript
const foo = cybozu.data["abc"];
```

```typescript
cybozu.data = 123;
```

#### ✅Correct

```typescript
// Use the official kintone JS API instead
const appId = kintone.app.getId();
const record = kintone.app.record.get();
```
