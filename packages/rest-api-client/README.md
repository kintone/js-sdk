# kintone-rest-api-client

[![npm version](https://badge.fury.io/js/%40kintone%2Frest-api-client.svg)](https://badge.fury.io/js/%40kintone%2Frest-api-client)
[![](https://github.com/kintone/js-sdk/workflows/test/badge.svg)](https://github.com/kintone/js-sdk/actions?workflow=test)
[![](https://github.com/kintone/js-sdk/workflows/lint/badge.svg)](https://github.com/kintone/js-sdk/actions?workflow=lint)

## Installation

```shell
npm install @kintone/rest-api-client
```

## Usage

```js
const { KintoneRestAPIClient } = require("@kintone/rest-api-client");

const client = new KintoneRestAPIClient({
  host: "https://example.cybozu.com",
  // Use password authentication
  auth: { username: "username", password: "password" }
  // Use API Token authentication
  // auth: { apiToken: "API_TOKEN" }

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
