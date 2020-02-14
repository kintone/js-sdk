# kintone-rest-api-client

[![npm version](https://badge.fury.io/js/%40kintone%2Frest-api-client.svg)](https://badge.fury.io/js/%40kintone%2Frest-api-client)

- [Installation](#installation)
- [Usage](#usage)
- [Parameters for `KintoneRestAPIClient`](#parameters-for-kintonerestapiclient)
- [Error Handling](#error-handling)
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

## Usage

Here is a sample code that retrieves records of an app.

```js
const client = new KintoneRestAPIClient({
  baseUrl: "https://example.cybozu.com",
  // Use password authentication
  auth: {
    username: process.env.KINTONE_USERNAME,
    password: process.env.KINTONE_PASSWORD
  }
  // Use API token authentication
  // auth: { apiToken: process.env.KINTONE_API_TOKEN }

  // Use session authentication if `auth` is omitted (in browser only)
});

client.record
  .getRecords({ app: "1" })
  .then(resp => {
    console.log(resp.records);
  })
  .catch(err => {
    console.log(err);
  });
```

## Parameters for `KintoneRestAPIClient`

| Name               |       Type       |          Required           | Description                                                                                                                                                                                                                  |
| ------------------ | :--------------: | :-------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| baseUrl            |      String      | Conditionally<br />Required | The base URL for your Kintone environment.<br />It must start with `https`. (e.g. https://example.kintone.com) <br />Required in Node.js environment. If you omit it in browser environment, `location.origin` will be used. |
| auth               |      Object      | Conditionally<br />Required | The object for authentication. See [Authentication](#Authentication).                                                                                                                                                        |
| guestSpaceId       | Number or String |                             | The guest space ID. If you are dealing with apps that are in guest spaces, please specify this.                                                                                                                              |
| basicAuth          |      Object      |                             | If your Kintone environment uses Basic authentication, please specify its username and password.                                                                                                                             |
| basicAuth.username |      String      |                             | The username of Basic authentication.                                                                                                                                                                                        |
| basicAuth.password |      String      |                             | The password of Basic authentication.                                                                                                                                                                                        |

### Authentication

The client supports three authentication methods:

1. [Password authentication](https://developer.kintone.io/hc/en-us/articles/212495188#passwordAuth)
2. [API token authentication](https://developer.kintone.io/hc/en-us/articles/212495188#APItokenAuth)
3. [Session authentication](https://developer.kintone.io/hc/en-us/articles/212495188#sessionAuth)

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

#### 3. [Session authentication](https://developer.kintone.io/hc/en-us/articles/212495188#sessionAuth)

Supported in browser environment only.
If you omit `auth` parameter, the client uses Session authentication.

## Error Handling

When the API request responds with a status code other than 200, the client raises [`KintoneRestAPIError`](src/KintoneRestAPIError.ts).

[`KintoneRestAPIError`](src/KintoneRestAPIError.ts) has the following properties:

| Name             |         Type          | Description                                                                                                                                                |
| ---------------- | :-------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               |        String         | The ID of the error.                                                                                                                                       |
| code             |        String         | The code of the error, to specify the type of error it is.                                                                                                 |
| status           |        Number         | The HTTP status of the response.                                                                                                                           |
| headers          |        Object         | The HTTP headers of the response.                                                                                                                          |
| message          |        String         | The error message.                                                                                                                                         |
| bulkRequestIndex | Number or `undefined` | The index of the failed request when executing [bulkRequest](docs/bulkRequest.md) and one of the requests fails.<br />This value is `undefined` otherwise. |

## References

- [Record](docs/record.md)
- [App](docs/app.md)
- [File](docs/file.md)
- [BulkRequest](docs/bulkRequest.md)

## Contribution Guide

- [CONTRIBUTING.md](../../CONTRIBUTING.md)

## License

- [MIT](LICENSE)
