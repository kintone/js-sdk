# BulkRequest

## Overview

```ts
const client = new KintoneRestAPIClient({
  baseUrl: location.origin,
});

(async () => {
  const APP_ID = "1";
  const RECORD_ID = "10";
  const FIELD_CODE = "foo";
  const params = {
    requests: [
      {
        method: "POST",
        api: "/k/v1/record.json",
        payload: {
          app: APP_ID,
          record: {
            [FIELD_CODE]: {
              value: "example",
            },
          },
        },
      },
      {
        method: "PUT",
        api: "/k/v1/record.json",
        payload: {
          app: APP_ID,
          id: RECORD_ID,
          record: {
            [FIELD_CODE]: {
              value: "example2",
            },
          },
        },
      },
    ],
  };
  try {
    const res = await client.bulkRequest(params);
    console.log(res);
  } catch (err) {
    console.log(err);
  }
})();
```

- This method returns a Promise object that is resolved with an object having properties in each `Returns` section.

## Methods

### bulkRequest

Runs multiple API requests sequentially to multiple apps.

#### Parameters

| Name                    |  Type  |          Required           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------- | :----: | :-------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| requests                | Array  |             Yes             | An array of requests. The maximum number of requests is 20.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| requests[].method       | String |             Yes             | The API method for the request.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| requests[].api          | String | Conditionally<br />Required | The path of the API for the request. Required, unless you specify `requests[].endpointName`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| requests[].endpointName | String | Conditionally<br />Required | The name of the API endpoint for the request. <br /> For example, You can send a request to `/k/v1/record.json` by specifying `record` for this parameter. <br /> Can be one of: <ul><li>`record`</li><li>`records`</li><li>`record/status`</li><li>`records/status`</li><li>`record/assignees`</li></ul>If you specify this parameter and [`guestSpaceId`](https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/README.md#parameters-for-kintonerestapiclient), the client sends the request to the guest space. <br /> Required, unless you specify `requests[].api` |
| requests[].payload      | Object |             Yes             | The parameters to be passed onto the API of the request. Contents and formats will change depending on the API.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

#### Returns

| Name    | Type  | Description                                                                                             |
| ------- | :---: | ------------------------------------------------------------------------------------------------------- |
| results | Array | The response from each API request. The order of the response is the same as the order of the requests. |

#### Reference

- https://kintone.dev/en/docs/kintone/rest-api/records/bulk-request/
