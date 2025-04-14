# @kintone/rest

[![npm version](https://badge.fury.io/js/@kintone%2Frest.svg)](https://badge.fury.io/js/@kintone%2Frest)
![Node.js version](https://img.shields.io/badge/node-%3E%3D20-blue)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-yellow.svg)](LICENSE)

**@kintone/rest** is a client library for accessing the kintone REST API from JavaScript or TypeScript applications.  
It is automatically generated using [openapi-typescript](https://github.com/openapi-ts/openapi-typescript).

- [Migration](#migration)
- [Installation](#installation)
- [Browsers support](#browsers-support)
- [Usage](#usage)
- [Parameters for `KintoneRest`](#parameters-for-kintonerest)
- [Helper functions](#helper-functions)
- [Contribution Guide](#contribution-guide)
- [License](#license)

## Migration

See the [Migration Guide](docs/migration-from-rest-api-client.md).

## Installation

### 1. Install with npm

Install the package via [npm](https://www.npmjs.com/package/@kintone/rest):

```shell
npm install @kintone/rest
```

Once installed, the library can be imported using either `require` or `import`:

```javascript
// CommonJS
const { createClient } = require("@kintone/rest");
// ES modules
import { createClient } from "@kintone/rest";
```

### 2. Load UMD files from CDN (for browser environment)

> [!IMPORTANT]
> To avoid cascading failures from the CDN, we recommend using the npm package and bundling it to your plugin/customization.

You can also load Universal Module Definition (UMD) files directly from Cybozu CDN:

- https://cybozu.dev/ja/kintone/sdk/library/cybozu-cdn/#kintone-rest

Regarding restrictions and availability, please check Cybozu CDN Policy:

- https://cybozu.dev/ja/policy/cybozu-cdn-policy/

After loading the UMD file, you can use `KintoneRest` in your environment.
In Kintone customization, please add the UMD file URL in the "JavaScript and CSS Customization" setting of your app.

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Latest version                                                                                                                                                                                        | Latest version                                                                                                                                                                                                    | Latest version                                                                                                                                                                                                | Latest version                                                                                                                                                                                                |

## Usage

Here's an example of how to retrieve records from a kintone app using TypeScript:

```ts
import { createClient } from "@kintone/rest";

const client = createClient({
  baseUrl: "https://example.cybozu.com",
  auth: {
    type: "password",
    username: process.env.KINTONE_USERNAME,
    password: process.env.KINTONE_PASSWORD,
  },
  // Use API token authentication
  // auth: {
  //   type: "apiToken",
  //   apiToken: process.env.KINTONE_API_TOKEN,
  // }
  // Use OAuth token authentication
  // auth: {
  //   type: "oauth",
  //   oAuthToken: process.env.KINTONE_OAUTH_TOKEN,
  // }
});

try {
  const resp = await client.request("get", "/k/v1/records.json", {
    params: {
      query: { app: 1 },
    },
  });
  console.log(resp.data?.records);
} catch (e) {
  console.error(e);
}
```

We recommend using TypeScript to take advantage of features like path and parameter autocompletion.
If you're using JavaScript, you can still create the client using the same code, though without those benefits.

## Parameters for `KintoneRest`

| Name                       |                               Type                               |          Required           | Description                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------- | :--------------------------------------------------------------: | :-------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| baseUrl                    |                              String                              | Conditionally<br />Required | The base URL for your Kintone environment.<br />It must start with `https`. (e.g. https://example.kintone.com) <br />Required in Node.js environment. If you omit it in browser environment, `location.origin` will be used.<br />The protocol of baseUrl must be `https` except when hostname is `localhost`.                                               |
| auth                       |                              Object                              | Conditionally<br />Required | The object for authentication. See [Authentication](#Authentication).                                                                                                                                                                                                                                                                                        |
| basicAuth                  |                              Object                              |                             | If your Kintone environment uses Basic authentication, please specify its username and password.                                                                                                                                                                                                                                                             |
| basicAuth.username         |                              String                              |                             | The username of Basic authentication.                                                                                                                                                                                                                                                                                                                        |
| basicAuth.password         |                              String                              |                             | The password of Basic authentication.                                                                                                                                                                                                                                                                                                                        |
| httpsAgent                 |                              Object                              |                             | **This parameter is available only in Node.js environment.**<br />The custom HTTPS agent to be used when making requests.<br />The agent should be compatible with [undici.Agent](https://github.com/nodejs/undici/blob/main/docs/docs/api/Agent.md).                                                                                                        |
| clientCertAuth             |                              Object                              |                             | **This parameter is available only in Node.js environment.**<br />**When `httpsAgent` parameter is given, this parameter is unavailable.**<br />If your Kintone environment uses [Client Certificate authentication](https://jp.cybozu.help/general/en/admin/list_security/list_access/secureaccess.html), please specify the certificate file and password. |
| clientCertAuth.pfx         | [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer) |                             | The [client certificate file](https://jp.cybozu.help/general/en/user/list_access/remote/webbrowser.html). Required, unless you specify `pfxFilePath`.                                                                                                                                                                                                        |
| clientCertAuth.pfxFilePath |                              String                              |                             | The path to [client certificate file](https://jp.cybozu.help/general/en/user/list_access/remote/webbrowser.html). Required, unless you specify `pfx`.                                                                                                                                                                                                        |
| clientCertAuth.password    |                              String                              |                             | The password of client certificate.                                                                                                                                                                                                                                                                                                                          |
| proxy                      |                              Object                              |                             | **This parameter is available only in Node.js environment.**<br />If you use a proxy, please specify its configuration.                                                                                                                                                                                                                                      |
| proxy.protocol             |                              String                              |                             | The protocol of the proxy server. Default is `http`.                                                                                                                                                                                                                                                                                                         |
| proxy.host                 |                              String                              |                             | The host of the proxy server.                                                                                                                                                                                                                                                                                                                                |
| proxy.port                 |                              Number                              |                             | The port of the proxy server.                                                                                                                                                                                                                                                                                                                                |
| proxy.auth                 |                              Object                              |                             | If the proxy server requires Basic authentication, please specify its username and password.                                                                                                                                                                                                                                                                 |
| proxy.auth.username        |                              String                              |                             | The username of Basic authentication for the proxy server.                                                                                                                                                                                                                                                                                                   |
| proxy.auth.password        |                              String                              |                             | The password of Basic authentication for the proxy server.                                                                                                                                                                                                                                                                                                   |
| userAgent                  |                              String                              |                             | **This parameter is available only in Node.js environment.**<br />A User-Agent HTTP header                                                                                                                                                                                                                                                                   |
| socketTimeout              |                              Number                              |                             | **This parameter is available only in Node.js environment.**<br />The socket timeout in milliseconds.                                                                                                                                                                                                                                                        |

### Authentication

The client supports three authentication methods:

1. [Password authentication](https://kintone.dev/en/docs/common/authentication/#password-authentication)
2. [API token authentication](https://kintone.dev/en/docs/common/authentication/#api-token-authentication)
3. [OAuth authentication](https://kintone.dev/en/docs/common/authentication/how-to-add-oauth-clients/)
4. [Session authentication](https://kintone.dev/en/docs/common/authentication/#session-authentication)

#### 1. Parameters for [Password authentication](https://kintone.dev/en/docs/common/authentication/#password-authentication)

| Name     |  Type  | Required | Description                |
| -------- | :----: | :------: | -------------------------- |
| type     | String |   Yes    | Please specify "password". |
| username | String |   Yes    |                            |
| password | String |   Yes    |                            |

#### 2. Parameters for [API token authentication](https://kintone.dev/en/docs/common/authentication/#api-token-authentication)

| Name     |        Type        | Required | Description                                             |
| -------- | :----------------: | :------: | ------------------------------------------------------- |
| type     |       String       |   Yes    | Please specify “apiToken”.                              |
| apiToken | String or String[] |   Yes    | You can pass multiple api tokens as an array of string. |

#### 3. Parameters for [OAuth authentication](https://kintone.dev/en/docs/common/authentication/how-to-add-oauth-clients/)

| Name       |  Type  | Required | Description                                                                                                                                                                |
| ---------- | :----: | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type       | String |   Yes    | Please specify “oauth”.                                                                                                                                                    |
| oAuthToken | String |   Yes    | An OAuth access token you get through the [OAuth process flow](https://kintone.dev/en/docs/common/authentication/how-to-add-oauth-clients/#authorization-code-grant-flow). |

#### 4. [Session authentication](https://kintone.dev/en/docs/common/authentication/#session-authentication)

| Name |  Type  | Required | Description               |
| ---- | :----: | :------: | ------------------------- |
| type | String |   Yes    | Please specify "session". |

Supported in browser environment only.
If you omit `auth` parameter, the client uses Session authentication.

## Helper functions

### Iterator helper

You can use the iterator to retrieve the API execution results efficiently.
For detailed usage examples, please refer to [https://github.com/kintone/js-sdk/blob/main/packages/rest/src/**tests**/helpers/iterator.test.ts](https://github.com/kintone/js-sdk/blob/main/packages/rest/src/__tests__/helpers/iterator.test.ts).

## Contribution Guide

See [CONTRIBUTING.md](https://github.com/kintone/js-sdk/tree/main/CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

- [Apache 2.0](LICENSE)
