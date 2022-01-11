# File

- [uploadFile](#uploadFile)
- [downloadFile](#downloadFile)

## Overview

```ts
const client = new KintoneRestAPIClient();

(async () => {
  const APP_ID = "1";
  const ATTACHMENT_FIELD_CODE = "Attachment";

  const FILE = {
    name: "Hello.txt",
    data: "Hello World!",
  };

  // Upload a file and attach it to a record
  const { fileKey } = await client.file.uploadFile({
    file: FILE,
  });
  const { id } = await client.record.addRecord({
    app: APP_ID,
    record: {
      [ATTACHMENT_FIELD_CODE]: {
        value: [{ fileKey }],
      },
    },
  });

  // Download the attached file
  const { record } = await client.record.getRecord({
    app: APP_ID,
    id,
  });
  const data = await client.file.downloadFile({
    fileKey: record[ATTACHMENT_FIELD_CODE].value[0].fileKey,
  });
  console.log(data.toString()); // Hello World!
})();
```

- All methods are defined on the `file` property.

## Methods

### uploadFile

Uploads a file to Kintone.

`uploadFile` returns a file key for the uploaded file.
You can use the file key at the following place.

- Attachment field in an app
- JavaScript and CSS customization settings of an app

#### Parameters

| Name      |                                                                 Type                                                                 |          Required           | Description                                                                                                                                         |
| --------- | :----------------------------------------------------------------------------------------------------------------------------------: | :-------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| file      |                                                                Object                                                                |             Yes             | An object includes file name and data.                                                                                                              |
| file.name |                                                                String                                                                | Conditionally<br />Required | The name for the file. Required, unless you specify `file.path`.                                                                                    |
| file.data | String or<br />[Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) or<br /> [Stream](https://nodejs.org/api/stream.html)\* | Conditionally<br />Required | The data for the file. Required, unless you specify `file.path`.<br>\* Stream is only available in Node.js environment.                             |
| file.path |                                                                String                                                                | Conditionally<br />Required | **This parameter is available only in Node.js environment.** <br /> The path to the file. Required, unless you specify `file.name` and `file.data`. |

#### Returns

`uploadFile` returns a Promise object that is resolved with an object having following properties.

| Name    |  Type  | Description                        |
| ------- | :----: | ---------------------------------- |
| fileKey | String | The file key of the uploaded file. |

#### Reference

- https://kintone.dev/en/docs/kintone/rest-api/files/upload-file/

### downloadFile

Downloads files using a file key.

This is **NOT** the file key `uploadFile` returns.
You can get the file key from the following place.

- Attachment field in an app
- JavaScript and CSS customization settings of an app

#### Parameters

| Name    |  Type  | Required | Description                          |
| ------- | :----: | :------: | ------------------------------------ |
| fileKey | String |   Yes    | The file key of the downloaded file. |

#### Returns

`downloadFile` returns a Promise object that is resolved with the following value.

| Name |                                                    Type                                                     | Description                             |
| ---- | :---------------------------------------------------------------------------------------------------------: | --------------------------------------- |
| data | [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | The corresponding data to the file key. |

#### Reference

- https://kintone.dev/en/docs/kintone/rest-api/files/download-file/
