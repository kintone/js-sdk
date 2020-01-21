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
    data: "Hello World!"
  };

  // Upload a file and attach it to a record
  const { fileKey } = await client.file.uploadFile({
　  file: FILE
　});
  const { id } = await client.record.addRecord({
    app: APP_ID,
    record: {
    [ATTACHMENT_FIELD_CODE]: {
        value: [{ fileKey }]
    }
  });

  // Download the attached file
  const { record } = await client.record.getRecord({
    app: APP_ID,
    id,
  });
  const data = await this.client.file.downloadFile({
    fileKey: record[ATTACHMENT_FIELD_CODE].value[0].fileKey
  });
  console.log(data.toString()); // Hello World!
})();
```

- All methods are defined on the `file` property.

## Methods

### uploadFile

Uploads a file to kintone.

`uploadFile` returns a file key for the uploaded file.
You can use the file key at the following place.

- Attachment field in an app
- JavaScript and CSS Customization settings of an app

#### Parameters

| Name      |                                     Type                                     | Required | Description                            |
| --------- | :--------------------------------------------------------------------------: | :------: | -------------------------------------- |
| file      |                                    Object                                    |   Yes    | An object includes file name and data. |
| file.name |                                    String                                    |   Yes    | The name for the file.                 |
| file.data | String or<br />[Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) |   Yes    | The data for the file.                 |

#### Returns

`uploadFile` returns a Promise object that is resolved with an object having following properties.

| Name    |  Type  | Description                        |
| ------- | :----: | ---------------------------------- |
| fileKey | String | The file key of the uploaded file. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/212494448

### downloadFile

Downloads files using a file key.

This is **NOT** the file key `uploadFile` returns.
You can get the file key from the following place.

- Attachment field in an app
- JavaScript and CSS Customization settings of an app

#### Parameters

| Name 　    |  Type  | Required | Description    |
| ---------- | :----: | :------: | -------------- |
| fileKey 　 | String |   Yes    | The Record ID. |

#### Returns

`downloadFile` returns a Promise object that is resolved with the following value.

| Name |                                                    Type                                                     | Description                          |
| ---- | :---------------------------------------------------------------------------------------------------------: | ------------------------------------ |
| data | [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | The Record ID of the created record. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/212494468
