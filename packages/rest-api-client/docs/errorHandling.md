# Error Handling

- [KintoneRestAPIError](#kintonerestapierror)
- [KintoneAllRecordsError](#kintoneallrecordserror)

## KintoneRestAPIError

When the API request responds with a status code other than 200, the client raises [`KintoneRestAPIError`](../src/KintoneRestAPIError.ts).

[`KintoneRestAPIError`](../src/KintoneRestAPIError.ts) has the following properties:

| Name             |         Type          | Description                                                                                                                                                |
| ---------------- | :-------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               |        String         | The ID of the error.                                                                                                                                       |
| code             |        String         | The code of the error, to specify the type of error it is.                                                                                                 |
| status           |        Number         | The HTTP status of the response.                                                                                                                           |
| headers          |        Object         | The HTTP headers of the response.                                                                                                                          |
| message          |        String         | The error message.                                                                                                                                         |
| bulkRequestIndex | Number or `undefined` | The index of the failed request when executing [bulkRequest](docs/bulkRequest.md) and one of the requests fails.<br />This value is `undefined` otherwise. |

## KintoneAllRecordsError

The following methods could throw `KintoneAllRecordsError`.

- [addAllRecords](record.md#addAllRecords)

`KintoneAllRecordsError` has the following properties.

| Name                   |                    Type                     | Description                                                                                                                                              |
| ---------------------- | :-----------------------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| processedRecordsResult |                    Array                    | The result of the records that have been processed successfully. This is the same type of `records` specified in the **Returns** section of each method. |
| unprocessedRecords     |                    Array                    | The records that have not been processed. This is a part of `records` passed as an argument.                                                             |
| error                  | [KintoneRestAPIError](#KintoneRestAPIError) | The instance of `KintoneRestAPIError`                                                                                                                    |
| errorIndex             |         Number or<br />`undefined`          | The index that an error ocurred.                                                                                                                         |
