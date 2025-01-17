# Migration from @kintone/rest-api-client

This topic provides instructions for migrating from `@kintone/rest-api-client` to `@kintone/rest`.

`@kintone/rest-api-client`は手作業でメソッドを開発していたのに対して、`@kintone/rest`は`openapi-ts/openapi-typescript`で自動生成しています。
これにより、常に最新のREST APIを`js-sdk`で利用することができます。

## Installation

```bash
npm install @kintone/rest
```

## Migration

### client

`@kintone/rest-api-client`では、以下のようにclientを作成していました。

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

`@kintone/rest`では、以下のようにclientを作成します。
`auth`を引数に取るのではなく、直接`headers`に設定します。

```ts
import { createClient, paths } from "@kintone/rest";

const client = createClient<paths>({
  baseUrl: "https://example.cybozu.com",
  headers: {
    "X-Cybozu-Authorization": process.env.KINTONE_AUTHORIZATION,
```

JavaScriptの場合は、以下のようになります。

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

`@kintone/rest-api-client`では、timeoutを設定するためのオプション`socketTimeout`が提供されていました。

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

`@kintone/rest`では、`signal`プロパティに`AbortSignal.timeout`を設定します。

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

#### user agent

`@kintone/rest-api-client`では、user agentを設定するためのオプションが提供されていました。

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

`@kintone/rest`では、`headers`に直接`User-Agent`を設定します。

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

#### proxy

`@kintone/rest-api-client`では、proxyを設定するためのオプションが提供されていました。

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

`@kintone/rest`では、proxyの設定を直接提供していません。
proxyを使用したい場合は、`undici`を使い、`requestInitExt`プロパティに`dispatcher`を設定します。

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

`@kintone/rest-api-client`では、`httpsAgent`を設定するためのオプションが提供されていました。
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
`@kintone/rest`では、`undici`を使い、`requestInitExt`プロパティに`dispatcher`を設定します。
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

`@kintone/rest-api-client`では、`client`インスタンスのメソッドとして提供されていました。

```ts
const getRecordsResponse = await client.record.getRecords({ app: "1" });
```

一方で`openapi-ts/openapi-typescript`で生成された`@kintone/rest`は、REST APIのパスを関数として提供します。

```ts
const getRecordsResponse = await client.GET("/k/v1/records.json", {
  params: {
    query: { app: 1 },
  },
});
```

APIのパスやリクエストなどの詳細は[仕様書](https://kintone.dev/en/)を参照ください。

#### guest space

`@kintone/rest-api-client`では、guest space用のクライアントを作成していました

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

`@kintone/rest`では、ゲストスペース用のエンドポイントを`path`に指定します。

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

`@kintone/rest-api-client`では、デプロイ前のアプリに対する操作は、メソッド引数に`preview: true`を指定することで行っていました。

```ts
const client = createClient({
  baseUrl: "https://example.cybozu.com",
  headers: {
    "X-Cybozu-Authorization": process.env.KINTONE_AUTHORIZATION,
  },
});
const getAppAcl = await client.app.getAppAcl({ app: "1", preview: true }));
```

`@kintone/rest`では、preview用のエンドポイントを`path`に指定します。

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

### サポート外

`@kintone/rest-api-client`では、以下のような機能が提供されていましたが、`@kintone/rest`では提供していません。

#### ブラウザでのセッション認証

セッション認証はサポートしていません。
APIトークンなど他の認証形式をご利用ください。

#### featureFlags

`@kintone/rest-api-client`では、[featureFlags](https://github.com/kintone/js-sdk/tree/main/packages/rest-api-client#feature-flags)を提供していましたが、`@kintone/rest`では提供しません。
