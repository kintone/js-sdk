# Disallow using internal kintone UI class names (`no-kintone-internal-selector`)

Detects usage of internal CSS class names.

## Why

Internal kintone UI class names are not officially supported. They may change or be removed without notice in future kintone updates, which could cause unexpected behavior in your customizations or plugins.

## Detected patterns

- `gaia-argoui-*` (e.g., `gaia-argoui-button`)
- `*-gaia` (e.g., `button-gaia`)
- `ocean-*` (e.g., `ocean-ui-button`)
- `kintone-*` (e.g., `kintone-dialog`)

Detects not only DOM API calls (`querySelector`, `querySelectorAll`, `closest`, `getElementsByClassName`, `matches`) but also class names in string literals (e.g., jQuery).

#### ❌Incorrect

```typescript
element.querySelector(".gaia-argoui-foo");
```

```typescript
element.querySelectorAll(".ocean-foo");
```

```typescript
element.getElementsByClassName("kintone-foo");
```

```typescript
element.querySelector(".foo > .foo-gaia");
```

```typescript
$(".gaia-argoui-foo");
```

```typescript
$(document).on("click", ".kintone-foo", handler);
```

#### ✅Correct

```typescript
// Use the official kintone JS API instead
const headerSpace = kintone.app.getHeaderMenuSpaceElement();
const fieldElement = kintone.app.record.getFieldElement("field_code");
const spaceElement = kintone.app.record.getSpaceElement("space_id");
```
