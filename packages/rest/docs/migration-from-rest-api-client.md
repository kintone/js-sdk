# Migration from @kintone/rest-api-client

This topic provides instructions for migrating from `@kintone/rest-api-client` to `@kintone/rest`.

- [Why New API Client?](#Why New API Client?)
- [Installation](#Installation)
- [Updating Codes](#Updating Codes)

## Why New API Client?

`@kintone/rest-api-client` was developed to provide a simple and easy-to-use API client for the kintone REST API.
However, we could not keep all methods updated along with the latest API specification because `@kintone/rest-api-client` has been developed manually.

On the other hand, API methods in `@kintone/rest` are automatically generated using [`openapi-ts/openapi-typescript`](https://github.com/openapi-ts/openapi-typescript).
So we can provide the latest API methods to you more immediately.

This migration allows you to always use the latest REST API with `js-sdk`.

## Installation

```bash
npm install @kintone/rest
```

## Updating Codes

### Client

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

With `@kintone/rest`, the client is also set the `auth` argument, but the `auth.type` is required.

```ts
import { createClient, paths } from "@kintone/rest";

const client = createClient<paths>({
  baseUrl: "https://example.cybozu.com",
  auth: {
    type: "password",
    username: process.env.KINTONE_USERNAME,
    password: process.env.KINTONE_PASSWORD,
  },
});
```

If you are using JavaScript, the sample code is as follows:

```js
import { createClient } from "@kintone/rest";

const client = createClient({
  baseUrl: "https://example.cybozu.com",
  auth: {
    type: "password",
    username: process.env.KINTONE_USERNAME,
    password: process.env.KINTONE_PASSWORD,
  },
});
```

#### Session Authentication in Browser

As well as `@kintone/rest-api-client`, session authentication is supported in browser environment only.

In `@kintone/rest-api-client`, you have imported the client from CDN, and the client was created without `auth` property.

```ts
import { KintoneRestAPIClient } from "@kintone/rest-api-client";

const client = new KintoneRestAPIClient();
```

`@kintone/rest` also provides from CDN,
and you can create a client without the `auth` property, or with `session auth` property.

```ts
const createClient = OpenAPIFetch.default;
const client = createClient({
  baseUrl: "https://example.cybozu.com",
});

// or

const client = createClient({
  baseUrl: "https://example.cybozu.com",
  auth: {
    type: "session",
  },
});
```

#### Timeout

In `@kintone/rest-api-client`, `socketTimeout` option was provided to set the timeout.

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

With `@kintone/rest`, you can also write the code similarly as follows:

```ts
import { createClient } from "@kintone/rest";
const client = createClient<paths>({
  baseUrl: "https://example.cybozu.com",
  auth: {
    type: "password",
    username: process.env.KINTONE_USERNAME,
    password: process.env.KINTONE_PASSWORD,
  },
  socketTimeout: 1000,
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

With `@kintone/rest`, you can also write the code similarly as follows:

```ts
import { createClient } from "@kintone/rest";
const client = createClient<paths>]({
  baseUrl: "https://example.cybozu.com",
  auth: {
    type: "password",
    username: process.env.KINTONE_USERNAME,
    password: process.env.KINTONE_PASSWORD,
  },
  userAgent: "your-user-agent",
});
```

#### Proxy

In `@kintone/rest-api-client`, an option was provided to set the `proxy`.

```ts
const client = new KintoneRestAPIClient({
  baseUrl: "https://example.cybozu.com",
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

With `@kintone/rest`, you can also write the code similarly as follows:

```ts
import { createClient } from "@kintone/rest";

const client = createClient<paths>({
  baseUrl: "https://example.cybozu.com",
  auth: {
    type: "password",
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

#### Https.Agent

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

With `@kintone/rest`, instead of `https`, you use `undici` to set `httpsAgent`.

```ts
import { Agent } from "undici";
import { createClient } from "openapi-fetch";

const client = createClient<paths>({
  baseUrl: "https://example.cybozu.com",
  auth: {
    type: "password",
    username: process.env.KINTONE_USERNAME,
    password: process.env.KINTONE_PASSWORD,
  },
  httpsAgent: new Agent({
    keepAlive: true,
  }),
});
```

#### Client Certificate Authentication

In `@kintone/rest-api-client`, an option was provided to set the `clientCertAuth`.

```ts
const client = new KintoneRestAPIClient({
  baseUrl: "https://example.s.cybozu.com",
  auth: {
    username: process.env.KINTONE_USERNAME,
    password: process.env.KINTONE_PASSWORD,
  },
  clientCertAuth: {
    pfxFilePath: "path/to/client-cert.pfx",
    password: "password",
  },
});
```

With `@kintone/rest`, you can use the same parameters.

```ts
const client = createClient<paths>({
  baseUrl: "https://example.s.cybozu.com",
  auth: {
    type: "password",
    username: process.env.KINTONE_USERNAME,
    password: process.env.KINTONE_PASSWORD,
  },
  clientCertAuth: {
    pfxFilePath: "path/to/client-cert.pfx",
    password: "password",
  },
});
```

> [!NOTE]
> You can select only one of these property: `proxy`, `httpsAgent`, `clientCertAuth`.

### Call API

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

For details on API paths and requests, see [specification](https://kintone.dev/en/).

#### Guest Space

In `@kintone/rest-api-client`, a client for a guest space was created.

```ts
const getRecordsResponse = await client.record.getRecords({ app: "1" }));
```

With `@kintone/rest`, specify an endpoint for a guest space in `path`.

```ts
const getRecordsResponse = await client.GET("/k/guest/1/v1/records.json", {
  params: {
    query: { app: 1 },
  },
});
```

#### Pre-live App Settings

In `@kintone/rest-api-client`, operations on pre-deployment apps were performed by specifying `preview: true` in the method arguments.

```ts
const getAppAcl = await client.app.getAppAcl({ app: "1", preview: true }));
```

With `@kintone/rest`, specify an endpoint for preview in `path`.

```ts
const getAppAclResponse = await client.GET("/k/v1/preview/app/acl.json", {
  params: {
    query: { app: 1 },
  },
});
```

### Unsupported Features

In `@kintone/rest-api-client`, the following features were provided, but they are not available in `@kintone/rest`.

#### Feature Flags

`@kintone/rest-api-client` provided [featureFlags](https://github.com/kintone/js-sdk/tree/main/packages/rest-api-client#feature-flags), but `@kintone/rest` does not offer this feature.
