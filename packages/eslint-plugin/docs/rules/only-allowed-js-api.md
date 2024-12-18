# Only allowed kintone JS API (`only-allowed-js-api`)

Only allow the kintone JS APIs listed in permissions.js_api in manifest.

#### ❌Incorrect

```json5
// manifest.json
{
  // ...
  permissions: {
    js_api: ["kintone.api"],
  },
}
```

```typescript
kintone.app.getId();
```

#### ✅Correct

```json5
// manifest.json
{
  // ...
  permissions: {
    js_api: ["kintone.api", "kintone.app.getId"],
  },
}
```

```typescript
kintone.app.getId();
```
