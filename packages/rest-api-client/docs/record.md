# Record

- [getRecord](#getRecord)
- [addRecord](#addRecord)
- [updateRecord](#updateRecord)
- [createCursor](#createCursor)
- [getRecordsByCursor](#getRecordsByCursor)
- [deleteCursor](#deleteCursor)

## Overview

```ts
const client = new KintoneRestAPIClient({
  baseUrl: location.origin
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
| id       | String | The Record ID of the created record. |
| revision | String | The revision number of the record.   |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/212494628

### updateRecord

Updates details of 1 record in an App by specifying its record number, or a different unique key.

#### Parameters

| Name            |       Type       |          Required           | Description                                                                                                                                                                                                     |
| --------------- | :--------------: | :-------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app             | Number or String |             Yes             | The App ID.                                                                                                                                                                                                     |
| id              | Number or String | Conditionally<br />Required | The Record ID of the record to be updated. Required, if `updateKey` will not be specified.                                                                                                                      |
| updateKey       |      Object      | Conditionally<br />Required | The unique key of the record to be updated. Required, if `id` will not be specified. To specify this field, the field must have the "Prohibit duplicate values" option turned on.                               |
| updateKey.field |      String      | Conditionally<br />Required | The field code of the unique key.<br />Required, if `updateKey` will be specified.                                                                                                                              |
| updateKey.value | Number or String | Conditionally<br />Required | The value of the unique key.<br />Required, if `updateKey` will be specified.                                                                                                                                   |
| revision        | Number or String |                             | The expected revision number. If the value does not match, an error will occur and the record will not be updated. If the value is not specified or is -1, the revision number will not be checked.             |
| record          |      Object      |                             | Field codes and values are specified in this object. If ignored, the record will not be updated. For field type specs, check the [Field Types](https://developer.kintone.io/hc/en-us/articles/212494818/) page. |

#### Returns

| Name     |  Type  | Description                        |
| -------- | :----: | ---------------------------------- |
| revision | String | The revision number of the record. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/213149027

### createCursor

Adds a cursor so that large amount of records can be obtained from an App.

#### Parameters

| Name   |       Type       | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------ | :--------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app    | Number or String |   Yes    | The App ID.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| fields | Array\<String\>  |          | The field codes to be included in the response when using the [Get Cursor API](https://developer.kintone.io/hc/en-us/articles/360000280502). <br /> If ignored, all accessible fields in the app will be returned.                                                                                                                                                                                                                    |
| query  |      String      |          | The query string that will specify what records will be responded when using the [Get Cursor API](https://developer.kintone.io/hc/en-us/articles/360000280502). <br /> Refer to the [Get Records API](https://developer.kintone.io/hc/en-us/articles/360019245194#optfunc) document for the operators and options that can be specified in the query string. <br /> If ignored, all accessible records from the App will be returned. |
| size   | Number or String |          | The maximum number of records the [Get Cursor API](https://developer.kintone.io/hc/en-us/articles/360000280502) can retrieve from this cursor with one request. <br /> The maximum number is 500 records. If ignored, the default number of records to be retrieved is 100.                                                                                                                                                           |

#### Returns

| Name       |  Type  | Description                                                 |
| ---------- | :----: | ----------------------------------------------------------- |
| id         | String | The cursor ID.                                              |
| totalCount | String | The total count of records that match the query conditions. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/360000280322

### getRecordsByCursor

Retrieves multiple records from an App by specifying the cursor ID.

#### Parameters

| Name |  Type  | Required | Description    |
| ---- | :----: | :------: | -------------- |
| id   | String |   Yes    | The cursor ID. |

#### Returns

| Name    |  Type   | Description                                                                                                                                                                                                                                                                                                                                                          |
| ------- | :-----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| records |  Array  | An array of objects that includes field data of records that match the query. <br /> The response is the same as the response for the [Get Records API](https://developer.kintone.io/hc/en-us/articles/213149287/#getrecords).                                                                                                                                       |
| next    | Boolean | States whether there are more records that can be acquired from the cursor. <ul><li>`true`: There are still records to be acquired. </li><li> `false`: There are no more records to be acquired. </li></ul> Run this API again with the same parameters to obtain the next set of records. <br /> The cursor will remain valid until all records have been obtained. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/360000280502

### deleteCursor

Deletes a cursor by specifying the cursor ID.

#### Parameters

| Name |  Type  | Required | Description    |
| ---- | :----: | :------: | -------------- |
| id   | String |   Yes    | The cursor ID. |

#### Returns

An empty object.

#### Reference

- https://developer.kintone.io/hc/en-us/articles/360000280522
