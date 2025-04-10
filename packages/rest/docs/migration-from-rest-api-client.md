# Migrating from `@kintone/rest-api-client`

This guide explains how to migrate from `@kintone/rest-api-client` to `@kintone/rest`.

- [Why a New API Client?](#why-a-new-api-client)
- [Installation](#installation)
- [Updating Code](#updating-code)
  - [Client](#client)
  - [Session Authentication in Browser](#session-authentication-in-browser)
  - [Timeout](#timeout)
  - [User Agent](#user-agent)
  - [Proxy](#proxy)
  - [HTTPS Agent](#https-agent)
  - [Client Certificate Authentication](#client-certificate-authentication)
  - [Calling the API](#calling-the-api)
  - [Guest Space](#guest-space)
  - [Pre-Live App Settings](#pre-live-app-settings)
  - [Unsupported Features](#unsupported-features)

---

## Why a New API Client?

`@kintone/rest-api-client` was originally developed to offer a simple and user-friendly client for interacting with the kintone REST API. However, because the client was maintained manually, it became difficult to keep all API methods fully aligned with the latest kintone API specifications.

In contrast, `@kintone/rest` automatically generates API methods using [`openapi-ts/openapi-typescript`](https://github.com/openapi-ts/openapi-typescript). This ensures that developers can always use the latest API methods via the `js-sdk`.

---

## Installation

```bash
npm install @kintone/rest
```

## Updating Code

### Client

`@kintone/rest` introduces a new method for client creation using `createClient`, and it requires an explicit `auth.type` parameter (e.g., `"password"`).

`@kintone/rest-api-client`:

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

**`@kintone/rest`:**

```ts
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

If you're using JavaScript, the following snippet shows how to create the client:

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

Both clients support session authentication in browser environments only.

In `@kintone/rest-api-client`, the client is created via the CDN without the `auth` parameter.

In `@kintone/rest`, the client is also created via the CDN. The `auth` parameter may be omitted or explicitly set to `{ type: "session" }`.

`@kintone/rest-api-client`:

```ts
import { KintoneRestAPIClient } from "@kintone/rest-api-client";

const client = new KintoneRestAPIClient();
```

**`@kintone/rest`:**

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

Both clients support the `socketTimeout` parameter.

`@kintone/rest-api-client`:

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

**`@kintone/rest`:**

```ts
import { createClient } from "@kintone/rest";
const client = createClient({
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

Both clients support the `userAgent` parameter.

`@kintone/rest-api-client`:

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

**`@kintone/rest`:**

```ts
import { createClient } from "@kintone/rest";
const client = createClient({
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

Both clients support the `proxy` parameter with `protocol`, `host`, and `port`.

`@kintone/rest-api-client`:

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

**`@kintone/rest`:**

```ts
import { createClient } from "@kintone/rest";

const client = createClient({
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

#### HTTPS Agent

In `@kintone/rest-api-client`, the `httpsAgent` parameter accepts an instance of Node.js's `https.Agent`, which is part of Node.js's built-in `https` module.

In `@kintone/rest`, the `httpsAgent` parameter must be an instance of `undici.Agent`, because the client is built on the `undici` HTTP library instead of Node’s default HTTP/HTTPS modules.

`@kintone/rest-api-client`:
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

**`@kintone/rest`:**

```ts
import { Agent } from "undici";
import { createClient } from "openapi-fetch";

const client = createClient({
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

Both clients support the `clientCertAuth` parameter with `pfxFilePath` and `password`.

`@kintone/rest-api-client`:

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

**`@kintone/rest`:**

```ts
const client = createClient({
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
> Only one of the following parameters can be specified: `proxy`, `httpsAgent`, or `clientCertAuth`.

### Calling the API

In `@kintone/rest-api-client`, API methods are grouped by service and accessed as methods on the client instance, such as `client.record.getRecords()`.

In contrast, `@kintone/rest`, generated using `openapi-ts/openapi-typescript`, uses a request-based approach where you specify the HTTP method and path directly.

`@kintone/rest-api-client`:

```ts
const getRecordsResponse = await client.record.getRecords({ app: "1" });
```

**`@kintone/rest`:**

```ts
const getRecordsResponse = await client.request("get", "/k/v1/records.json", {
  params: {
    query: { app: 1 },
  },
});
```

For details on API paths and requests, see the [specifications](https://kintone.dev/en/).

#### Guest Space

In `@kintone/rest-api-client`, the guest space ID is passed as a method parameter.

In `@kintone/rest`, the guest space ID must be specified in the API path and provided via the `params.path` object.

`@kintone/rest-api-client`:

```ts
const getRecordsResponse = await client.record.getRecords({
  app: "1",
  guestSpaceId: 1,
});
```

**`@kintone/rest`:**

```ts
const getRecordsResponse = await client.request(
  "get",
  "/k/guest/{guestSpaceId}/v1/records.json",
  {
    params: {
      path: { guestSpaceId: 1 },
      query: { app: 1 },
    },
  },
);
```

#### Pre-Live App Settings

In `@kintone/rest-api-client`, the `preview: true` parameter is passed to target pre-deployment apps.

In `@kintone/rest`, you must explicitly use the preview endpoint in the API path.

`@kintone/rest-api-client`:

```ts
const getAppAcl = await client.app.getAppAcl({ app: "1", preview: true });
```

**`@kintone/rest`:**

```ts
const getAppAclResponse = await client.request(
  "get",
  "/k/v1/preview/app/acl.json",
  {
    params: {
      query: { app: 1 },
    },
  },
);
```

### Unsupported Features

The following feature is unavailable in `@kintone/rest`.

#### Feature Flags

`@kintone/rest-api-client` supports feature flags via the [featureFlags](https://github.com/kintone/js-sdk/tree/main/packages/rest-api-client#feature-flags) parameter.
This is not supported in `@kintone/rest`.
