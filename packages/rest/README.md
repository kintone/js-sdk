# @kintone/rest

[![npm version](https://badge.fury.io/js/@kintone%2Frest.svg)](https://badge.fury.io/js/@kintone%2Frest)
![Node.js version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/kintone/js-sdk/main/packages/rest/package.json&label=node&query=$.engines.node&colorB=blue)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-yellow.svg)](LICENSE)

**@kintone/rest** is a client library for accessing the kintone REST API from JavaScript or TypeScript applications.  
It is automatically generated using [openapi-typescript](https://github.com/openapi-ts/openapi-typescript).

> [!WARNING] **Experimental**: This package is in early development and subject to change.

- [Migration](#migration)
- [Installation](#installation)
- [Usage](#usage)
- [References](#references)
- [Contribution Guide](#contribution-guide)
- [License](#license)

## Migration

See the [Migration Guide](docs/migration-from-rest-api-client.md).

## Installation

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

## Browser Support

TODO

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

## Contribution Guide

See [CONTRIBUTING.md](https://github.com/kintone/js-sdk/tree/main/CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

- [Apache 2.0](LICENSE)
