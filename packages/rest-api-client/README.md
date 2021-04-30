# kintone-rest-api-client

[![npm version](https://badge.fury.io/js/%40kintone%2Frest-api-client.svg)](https://badge.fury.io/js/%40kintone%2Frest-api-client)

API client for Kintone REST API.
It supports both browser environment (Kintone customization & plugin) and Node.js environment.

- [Installation](#installation)
- [Browsers support](#browsers-support)
- [Usage](#usage)
- [Parameters for `KintoneRestAPIClient`](#parameters-for-kintonerestapiclient)
- [Error Handling](#error-handling)
- [TypeScript](#typescript)
- [References](#references)
- [Contribution Guide](#contribution-guide)
- [License](#license)

## Installation

### 1. Install with `npm`

This library is distributed on `npm`.

```shell
npm install @kintone/rest-api-client
```

You can then use `require` or `import` to import the library.

```javascript
// CommonJS
const { KintoneRestAPIClient } = require("@kintone/rest-api-client");
// ES modules
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
```

### 2. UMD files (for browser environment)

This library also provides two Universal Module Definition (UMD) files:

- https://unpkg.com/@kintone/rest-api-client@latest/umd/KintoneRestAPIClient.js
- minified one: https://unpkg.com/@kintone/rest-api-client@latest/umd/KintoneRestAPIClient.min.js

After loading this, you can use `KintoneRestAPIClient` directly.
In Kintone customization, please add this URL in "JavaScript and CSS Customization" setting of your app.

NOTE: The UMD links are using the `latest` tag to point to the latest version of the library. This pointer is unstable, it shifts as we release new versions. You should consider pointing to a specific version, such as [`1.0.0`](https://unpkg.com/@kintone/rest-api-client@1.0.0/umd/KintoneRestAPIClient.js).

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png" alt="IE" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11                                                                                                                                                                                                                                          | Latest version                                                                                                                                                                                        | Latest version                                                                                                                                                                                                    | Latest version                                                                                                                                                                                                | Latest version                                                                                                                                                                                                |

## Usage

Here is a sample code that retrieves records of an app.

```js
const client = new KintoneRestAPIClient({
  baseUrl: "https://example.cybozu.com",
  // Use password authentication
  auth: {
    username: process.env.KINTONE_USERNAME,
    password: process.env.KINTONE_PASSWORD,
  },
  // Use API token authentication
  // auth: { apiToken: process.env.KINTONE_API_TOKEN }
  // Use OAuth token authentication
  // auth: { oAuthToken: process.env.KINTONE_OAUTH_TOKEN }

  // Use session authentication if `auth` is omitted (in browser only)
});

client.record
  .getRecords({ app: "1" })
  .then((resp) => {
    console.log(resp.records);
  })
  .catch((err) => {
    console.log(err);
  });
```

## Global

| Name    |  Type  |                    Description                     |
| ------- | :----: | :------------------------------------------------: |
| version | String | Provides the used version of KintoneRestAPIClient. |

## Parameters for `KintoneRestAPIClient`

| Name                       |                               Type                               |          Required           | Description                                                                                                                                                                                                                                                                      |
| -------------------------- | :--------------------------------------------------------------: | :-------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| baseUrl                    |                              String                              | Conditionally<br />Required | The base URL for your Kintone environment.<br />It must start with `https`. (e.g. https://example.kintone.com) <br />Required in Node.js environment. If you omit it in browser environment, `location.origin` will be used.                                                     |
| auth                       |                              Object                              | Conditionally<br />Required | The object for authentication. See [Authentication](#Authentication).                                                                                                                                                                                                            |
| guestSpaceId               |                         Number or String                         |                             | The guest space ID. If you are dealing with apps that are in guest spaces, please specify this.                                                                                                                                                                                  |
| basicAuth                  |                              Object                              |                             | If your Kintone environment uses Basic authentication, please specify its username and password.                                                                                                                                                                                 |
| basicAuth.username         |                              String                              |                             | The username of Basic authentication.                                                                                                                                                                                                                                            |
| basicAuth.password         |                              String                              |                             | The password of Basic authentication.                                                                                                                                                                                                                                            |
| clientCertAuth             |                              Object                              |                             | **This parameter is available only in Node.js environment.**<br />If your Kintone environment uses [Client Certificate authentication](https://jp.cybozu.help/general/en/admin/list_security/list_secureaccess/overview.html), please specify the certificate file and password. |
| clientCertAuth.pfx         | [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer) |                             | The [client certificate file](https://jp.cybozu.help/general/en/user/list_access/remote/webbrowser.html). Required, unless you specify `pfxFilePath`.                                                                                                                            |
| clientCertAuth.pfxFilePath |                              String                              |                             | The path to [client certificate file](https://jp.cybozu.help/general/en/user/list_access/remote/webbrowser.html). Required, unless you specify `pfx`.                                                                                                                            |
| clientCertAuth.password    |                              String                              |                             | The password of client certificate.                                                                                                                                                                                                                                              |
| proxy                      |                              Object                              |                             | **This parameter is available only in Node.js environment.**<br />If you use a proxy, please specify its configuration.                                                                                                                                                          |
| proxy.host                 |                              String                              |                             | The host of the proxy server.                                                                                                                                                                                                                                                    |
| proxy.port                 |                              Number                              |                             | The port of the proxy server.                                                                                                                                                                                                                                                    |
| proxy.auth                 |                              Object                              |                             | If the proxy server requires Basic authentication, please specify its username and password.                                                                                                                                                                                     |
| proxy.auth.username        |                              String                              |                             | The username of Basic authentication for the proxy server.                                                                                                                                                                                                                       |
| proxy.auth.password        |                              String                              |                             | The password of Basic authentication for the proxy server.                                                                                                                                                                                                                       |
| userAgent                  |                              String                              |                             | **This parameter is available only in Node.js environment.**<br />A User-Agent HTTP header                                                                                                                                                                                       |
| featureFlags               |                              Object                              |                             | Feature flags that you can configure. See [Feature flags](#Feature-flags).                                                                                                                                                                                                       |

### Authentication

The client supports three authentication methods:

1. [Password authentication](https://developer.kintone.io/hc/en-us/articles/212495188#passwordAuth)
2. [API token authentication](https://developer.kintone.io/hc/en-us/articles/212495188#APItokenAuth)
3. [OAuth authentication](https://developer.kintone.io/hc/en-us/articles/360001562353-How-to-add-OAuth-clients)
4. [Session authentication](https://developer.kintone.io/hc/en-us/articles/212495188#sessionAuth)

The required parameters inside `auth` are different by the methods.
The client determines which method to use by passed parameters.

#### 1. Parameters for [Password authentication](https://developer.kintone.io/hc/en-us/articles/212495188#passwordAuth)

| Name     |  Type  | Required | Description |
| -------- | :----: | :------: | ----------- |
| username | String |   Yes    |
| password | String |   Yes    |

#### 2. Parameters for [API token authentication](https://developer.kintone.io/hc/en-us/articles/212495188#APItokenAuth)

| Name     |        Type        | Required | Description                                             |
| -------- | :----------------: | :------: | ------------------------------------------------------- |
| apiToken | String or String[] |   Yes    | You can pass multiple api tokens as an array of string. |

#### 3. Parameters for [OAuth authentication](https://developer.kintone.io/hc/en-us/articles/360001562353-How-to-add-OAuth-clients)

| Name       |  Type  | Required | Description                                                                                                                                           |
| ---------- | :----: | :------: | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| oAuthToken | String |   Yes    | An OAuth access token you get through the [OAuth process flow](https://developer.kintone.io/hc/en-us/articles/360001562353-How-to-add-OAuth-clients). |

#### 4. [Session authentication](https://developer.kintone.io/hc/en-us/articles/212495188#sessionAuth)

Supported in browser environment only.
If you omit `auth` parameter, the client uses Session authentication.

Session authentication is available in Garoon customization.

### Feature flags

| Name                   |  Type   | Default | Description                                                     |
| ---------------------- | :-----: | :-----: | --------------------------------------------------------------- |
| enableAbortSearchError | boolean | `false` | An option of whether to throw `KintoneAbortSearchError` or not. |

## Error Handling

See [Error Handling](https://github.com/kintone/js-sdk/tree/master/packages/rest-api-client/docs/errorHandling.md)

## TypeScript

See [TypeScript Definitions](https://github.com/kintone/js-sdk/tree/master/packages/rest-api-client/docs/typescript.md)

## References

- [Record](https://github.com/kintone/js-sdk/tree/master/packages/rest-api-client/docs/record.md)
- [App](https://github.com/kintone/js-sdk/tree/master/packages/rest-api-client/docs/app.md)
- [File](https://github.com/kintone/js-sdk/tree/master/packages/rest-api-client/docs/file.md)
- [BulkRequest](https://github.com/kintone/js-sdk/tree/master/packages/rest-api-client/docs/bulkRequest.md)

## Contribution Guide

- [CONTRIBUTING.md](https://github.com/kintone/js-sdk/tree/master/CONTRIBUTING.md)

## License

- [MIT](https://github.com/kintone/js-sdk/tree/master/LICENSE)
