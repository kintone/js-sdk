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

## KintoneRestAPIClient

| Name               |       Type       |          Required           | Description                                                                                                                                                                                                                  |
| ------------------ | :--------------: | :-------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| baseUrl            |      String      | Conditionally<br />Required | The base URL for your Kintone environment.<br />It must start with `https`. (e.g. https://example.kintone.com) <br />Required in Node.js environment. If you omit it in browser environment, `location.origin` will be used. |
| auth               |      Object      | Conditionally<br />Required |                                                                                                                                                                                                                              |
| guestSpaceId       | Number or String |                             | The guest space ID. If you operate apps made inside a guest space, please specify this.                                                                                                                                      |
| basicAuth          |      Object      |                             | If your Kintone environment uses [Basic authentication](https://developer.kintone.io/hc/en-us/articles/212495188#basicauthentication), please specify its username and password.                                             |
| basicAuth.username |      String      |                             | The username of Basic authentication.                                                                                                                                                                                        |
| basicAuth.password |      String      |                             | The password of Basic authentication.                                                                                                                                                                                        |
## KintoneRestAPIError

## References

- [Record](docs/record.md)
- [App](docs/app.md)
- [File](docs/file.md)
- [BulkRequest](docs/bulkRequest.md)

## Contribution Guide

- [CONTRIBUTING.md](../../CONTRIBUTING.md)

## License

- [MIT](LICENSE)
