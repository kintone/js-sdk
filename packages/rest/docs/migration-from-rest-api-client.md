# Migration from @kintone/rest-api-client

This topic provides instructions for migrating from `@kintone/rest-api-client` to `@kintone/rest`.

While `@kintone/rest-api-client` involved manually developing methods, `@kintone/rest` is automatically generated using [`openapi-ts/openapi-typescript`](https://github.com/openapi-ts/openapi-typescript).
This allows you to always use the latest REST API with `js-sdk`.

## Installation

```bash
npm install @kintone/rest
```

## Migration

### client

In `@kintone/rest-api-client`, the client was created as follows:

```ts
import { KintoneRestAPIClient } from "@kintone/rest-api-client";

const client = new KintoneRestAPIClient({
  baseUrl: "https://example.cybozu.com",
  // Use password authentication
  auth: {
    username: process.env.KINTONE_USERNAME,
    password: process.env.KINTONE_PASSWORD,
  },
});
```

In `@kintone/rest`, the client is created as follows.
Instead of taking `auth` as an argument, it is set directly in `headers`.

```ts
import { createClient, paths } from "@kintone/rest";

const client = createClient<paths>({
  baseUrl: "https://example.cybozu.com",
  headers: {
    "X-Cybozu-Authorization": process.env.KINTONE_AUTHORIZATION,
```

For JavaScript, it looks like this:

```js
import { createClient } from "@kintone/rest";

const client = createClient({
  baseUrl: "https://example.cybozu.com",
  headers: {
    "X-Cybozu-Authorization": process.env.KINTONE_AUTHORIZATION,
  },
});
```

#### timeout

In `@kintone/rest-api-client`, an option `socketTimeout` was provided to set the timeout.

```ts
const client = new KintoneRestAPIClient({
  baseUrl: "https://example.cybozu.com",
  auth: {
    username: process.env.KINTONE_USERNAME,
    password: process.env.KINTONE_PASSWORD,
  },
  socketTimeout: 1000,
});
```

In `@kintone/rest`, set `AbortSignal.timeout` in the `signal` property.

```ts
import { createClient } from "@kintone/rest";
const client = createClient<paths>({
  baseUrl: "https://example.cybozu.com",
  headers: {
    "X-Cybozu-Authorization": process.env.KINTONE_AUTHORIZATION,
  },
  signal: AbortSignal.timeout(1000),
});
```

#### User Agent

In `@kintone/rest-api-client`, an option was provided to set the User Agent.

```ts
const client = new KintoneRestAPIClient({
  baseUrl: "https://example.cybozu.com",
  auth: {
    username: process.env.KINTONE_USERNAME,
    password: process.env.KINTONE_PASSWORD,
  },
  userAgent: "your-user-agent",
});
```

In `@kintone/rest`, set `User-Agent` directly in `headers`.

```ts
import { createClient } from "@kintone/rest";
const client = createClient<paths>]({
  baseUrl: "https://example.cybozu.com",
  headers: {
    "X-Cybozu-Authorization": process.env.KINTONE_AUTHORIZATION,
    "User-Agent": "your-user-agent",
    },
});
```

#### Proxy

In `@kintone/rest-api-client`, an option was provided to set the `proxy`.

```ts
const client = new KintoneRestAPIClient({
  baseUrl: "https://example.cybozu.com",
  // Use password authentication
  auth: {
    username: process.env.KINTONE_USERNAME,
    password: process.env.KINTONE_PASSWORD,
  },
  proxy: {
    protocol: "http",
    host: "your.proxy.host",
    port: 1234,
  },
});
```

In `@kintone/rest`, proxy settings are not provided directly.
If you want to use a proxy, use `undici` and set `dispatcher` in the `requestInitExt` property.

```ts
import { ProxyAgent } from "undici";
import { createClient } from "openapi-fetch";

const client = createClient<paths>({
  baseUrl: "https://example.cybozu.com",
  headers: {
    "X-Cybozu-Authorization": process.env.KINTONE_AUTHORIZATION,
  },
  requestInitExt: {
    dispatcher: new ProxyAgent({
      uri: "http://your-proxy-server:port",
    }),
  },
});
```

#### HttpsAgent

In `@kintone/rest-api-client`, an option was provided to set `httpsAgent`.

```ts
import https from "https";

const agent = new https.Agent({});
const client = new KintoneRestAPIClient({
  baseUrl: "https://example.cybozu.com",
  auth: {
    username: process.env.KINTONE_USERNAME,
    password: process.env.KINTONE_PASSWORD,
  },
  httpsAgent: new HttpsAgent({
    keepAlive: true,
  }),
});
```

In `@kintone/rest`, proxy settings are not provided directly.
If you want to use a proxy, use `undici` and set `dispatcher` in the `requestInitExt` property.

```ts
import { Agent } from "undici";
import { createClient } from "openapi-fetch";

const client = createClient<paths>({
  baseUrl: "https://example.cybozu.com",
  headers: {
    "X-Cybozu-Authorization": process.env.KINTONE_AUTHORIZATION,
  },
  requestInitExt: {
    dispatcher: new Agent({}),
  },
});
```

#### Client Certificate Authentication

TODO

<!-- ```ts -->
<!-- import { ProxyAgent } from "undici"; -->
<!-- import { fs } from "fs"; -->
<!---->
<!-- // クライアント証明書と秘密鍵の読み込み -->
<!-- const cert = fs.readFileSync('path/to/client-cert.pem'); -->
<!-- const key = fs.readFileSync('path/to/client-key.pem'); -->
<!-- const ca = fs.readFileSync('path/to/ca-cert.pem'); // オプション -->
<!---->
<!-- // カスタムエージェントを作成 -->
<!-- const agent = new Agent({ -->
<!--   connect: { -->
<!--     key,           // クライアント証明書の秘密鍵 -->
<!--     cert,          // クライアント証明書 -->
<!--     ca,            // 信頼するCA証明書（必要に応じて） -->
<!--     rejectUnauthorized: true, // 証明書の検証を有効にする（デフォルト:true） -->
<!--   }, -->
<!-- }); -->
<!-- ``` -->

### call API

In `@kintone/rest-api-client`, methods were provided as part of the `client` instance.

```ts
const getRecordsResponse = await client.record.getRecords({ app: "1" });
```

On the other hand, `@kintone/rest` generated by `openapi-ts/openapi-typescript` provides REST API paths as functions.

```ts
const getRecordsResponse = await client.GET("/k/v1/records.json", {
  params: {
    query: { app: 1 },
  },
});
```

For details on API paths and requests, please refer to the [specification](https://kintone.dev/en/).

#### guest space

In `@kintone/rest-api-client`, a client for guest space was created.

```ts
const client = createClient({
  baseUrl: "https://example.cybozu.com",
  headers: {
    "X-Cybozu-Authorization": process.env.KINTONE_AUTHORIZATION,
  },
  guestSpaceId: 1,
});
const getRecordsResponse = await client.record.getRecords({ app: "1" }));
```

In `@kintone/rest`, specify the endpoint for the guest space in `path`.

```ts
const client = createClient({
  baseUrl: "https://example.cybozu.com",
  headers: {
    "X-Cybozu-Authorization": process.env.KINTONE_AUTHORIZATION,
  },
});

const getRecordsResponse = await client.GET("/k/guest/1/v1/records.json", {
  params: {
    query: { app: 1 },
  },
});
```

#### preview app

In `@kintone/rest-api-client`, operations on pre-deployment apps were performed by specifying `preview: true` in the method arguments.

```ts
const client = createClient({
  baseUrl: "https://example.cybozu.com",
  headers: {
    "X-Cybozu-Authorization": process.env.KINTONE_AUTHORIZATION,
  },
});
const getAppAcl = await client.app.getAppAcl({ app: "1", preview: true }));
```

In `@kintone/rest`, specify the endpoint for preview in `path`.

```ts
const client = createClient({
  baseUrl: "https://example.cybozu.com",
  headers: {
    "X-Cybozu-Authorization": process.env.KINTONE_AUTHORIZATION,
  },
});

const getAppAclResponse = await client.GET("/k/v1/preview/app/acl.json", {
  params: {
    query: { app: 1 },
  },
});
```

### Unsupported Features

In `@kintone/rest-api-client`, the following features were provided, but they are not available in `@kintone/rest`.

#### Session Authentication in Browser

Session authentication is not supported.
Please use other authentication methods such as API tokens.

#### Feature Flags

`@kintone/rest-api-client` provided [featureFlags](https://github.com/kintone/js-sdk/tree/main/packages/rest-api-client#feature-flags), but `@kintone/rest` does not offer this feature.
