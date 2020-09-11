# FieldTypes

## Overview

```ts
import { KintoneField } from "@kintone/rest-api-client";

const client = new KintoneRestAPIClient();

(async () => {
  try {
    const record = await client.record.getRecord({ app: "1", id: "10" });
    const field = Object.values<KintoneField.Field>(res.record).filter(
      (x: KintoneField.Field) => x.type === "__ID__"
    );
  } catch (err) {
    console.log(err);
  }
})();
```

## Types
### Field

```ts
import { KintoneField } from "@kintone/rest-api-client";
```

### Layout

```ts
import { KintoneLayout } from "@kintone/rest-api-client";
```

### Property

```ts
import { KintoneProperty } from "@kintone/rest-api-client";
```

## Properties detail
Check the [Field Type](https://developer.kintone.io/hc/en-us/articles/212494818/) page.