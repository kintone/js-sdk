# Record

- [getRecord](#getRecord)
- [addRecord](#addRecord)

## Overview

```ts
const client = new KintoneRestAPIClient({
  host: location.origin
});

(async () => {
  try {
    const res = await client.record.getRecord({ app: "1", id: "10" });
  } catch (err) {
    console.log(err);
  }
})();
```

- All methods are defined on the `record` property.
- All methods return a Promise object that is resolved with an object having properties in each `Returns` section.

## Methods

### getRecord

Retrieves details of 1 record from an App by specifying the App ID and Record ID.

#### Parameters

| Name |       Type       | Required | Description    |
| ---- | :--------------: | :------: | -------------- |
| app  | Number or String |   Yes    | The App ID.    |
| id   | Number or String |   Yes    | The Record ID. |

#### Returns

| Name   |  Type  | Description                                                                    |
| ------ | :----: | ------------------------------------------------------------------------------ |
| record | Object | The type and value of all fields within the record are included in the object. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/213149287

### addRecord

Adds 1 record to an App.

#### Parameters

| Name   |       Type       | Required | Description                                                                                                                                                                                                                                                                                                                    |
| ------ | :--------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| app    | Number or String |   Yes    | The App ID.                                                                                                                                                                                                                                                                                                                    |
| record |      Object      |   Yes    | Field codes and values are specified in this object. <br /> If ignored, the record will be added with default field values. <br /> If field codes that don't exist are specified, these will be ignored. <br /> For field type specs, check the [Field Types](https://developer.kintone.io/hc/en-us/articles/212494818/) page. |

#### Returns

| Name     |  Type  | Description                          |
| -------- | :----: | ------------------------------------ |
| id       | String | The Record ID of the created Record. |
| revision | String | The revision number of the Record.   |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/212494628
