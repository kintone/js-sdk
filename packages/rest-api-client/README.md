# kintone-rest-api-client

[![npm version](https://badge.fury.io/js/%40kintone%2Frest-api-client.svg)](https://badge.fury.io/js/%40kintone%2Frest-api-client)

## Installation

```shell
npm install @kintone/rest-api-client
```

## Usage

```js
const { KintoneRestAPIClient } = require("@kintone/rest-api-client");

const client = new KintoneRestAPIClient({
  baseUrl: "https://example.cybozu.com",
  // Use password authentication
  auth: {
    username: process.env.KINTONE_USERNAME,
    password: process.env.KINTONE_PASSWORD
  }
  // Use API Token authentication
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
