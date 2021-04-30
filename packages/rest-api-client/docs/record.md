# Record

- [getRecord](#getRecord)
- [addRecord](#addRecord)
- [updateRecord](#updateRecord)
- [upsertRecord](#upsertRecord)
- [getRecords](#getRecords)
- [getAllRecords](#getAllRecords)
- [getAllRecordsWithId](#getAllRecordsWithId)
- [getAllRecordsWithOffset](#getAllRecordsWithOffset)
- [getAllRecordsWithCursor](#getAllRecordsWithCursor)
- [addRecords](#addRecords)
- [addAllRecords](#addAllRecords)
- [updateRecords](#updateRecords)
- [updateAllRecords](#updateAllRecords)
- [deleteRecords](#deleteRecords)
- [deleteAllRecords](#deleteAllRecords)
- [getRecordComments](#getRecordComments)
- [addRecordComment](#addRecordComment)
- [deleteRecordComment](#deleteRecordComment)
- [createCursor](#createCursor)
- [getRecordsByCursor](#getRecordsByCursor)
- [deleteCursor](#deleteCursor)
- [updateRecordAssignees](#updateRecordAssignees)
- [updateRecordStatus](#updateRecordStatus)
- [updateRecordsStatus](#updateRecordsStatus)

## Overview

```ts
const client = new KintoneRestAPIClient();

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

Retrieves details of 1 record from an app by specifying the app ID and record ID.

#### Parameters

| Name |       Type       | Required | Description    |
| ---- | :--------------: | :------: | -------------- |
| app  | Number or String |   Yes    | The app ID.    |
| id   | Number or String |   Yes    | The record ID. |

#### Returns

| Name   |  Type  | Description                                                                    |
| ------ | :----: | ------------------------------------------------------------------------------ |
| record | Object | The type and value of all fields within the record are included in the object. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/213149287

### addRecord

Adds 1 record to an app.

#### Parameters

| Name   |       Type       | Required | Description                                                                                                                                                                                                                                                                                                                    |
| ------ | :--------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| app    | Number or String |   Yes    | The app ID.                                                                                                                                                                                                                                                                                                                    |
| record |      Object      |          | Field codes and values are specified in this object. <br /> If ignored, the record will be added with default field values. <br /> If field codes that don't exist are specified, these will be ignored. <br /> For field type specs, check the [Field Types](https://developer.kintone.io/hc/en-us/articles/212494818/) page. |

#### Returns

| Name     |  Type  | Description                          |
| -------- | :----: | ------------------------------------ |
| id       | String | The record ID of the created record. |
| revision | String | The revision number of the record.   |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/212494628

### updateRecord

Updates details of 1 record in an app by specifying its record number, or a different unique key.

#### Parameters

| Name            |       Type       |          Required           | Description                                                                                                                                                                                                     |
| --------------- | :--------------: | :-------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app             | Number or String |             Yes             | The app ID.                                                                                                                                                                                                     |
| id              | Number or String | Conditionally<br />Required | The record ID of the record to be updated. Required, if `updateKey` will not be specified.                                                                                                                      |
| updateKey       |      Object      | Conditionally<br />Required | The unique key of the record to be updated. Required, if `id` will not be specified. To specify this field, the field must have the "Prohibit duplicate values" option turned on.                               |
| updateKey.field |      String      | Conditionally<br />Required | The field code of the unique key.<br />Required, if `updateKey` will be specified.                                                                                                                              |
| updateKey.value | Number or String | Conditionally<br />Required | The value of the unique key.<br />Required, if `updateKey` will be specified.                                                                                                                                   |
| revision        | Number or String |                             | The expected revision number. If the value does not match, an error will occur and the record will not be updated. If the value is not specified or is `-1`, the revision number will not be checked.           |
| record          |      Object      |                             | Field codes and values are specified in this object. If ignored, the record will not be updated. For field type specs, check the [Field Types](https://developer.kintone.io/hc/en-us/articles/212494818/) page. |

#### Returns

| Name     |  Type  | Description                        |
| -------- | :----: | ---------------------------------- |
| revision | String | The revision number of the record. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/213149027

### upsertRecord

Updates or inserts details of 1 record in an app.
This method updates a record if the unique key specified by `updateKey` has matched any record, otherwise processed as an insert.

#### Parameters

| Name            |       Type       | Required | Description                                                                                                                                                                                                     |
| --------------- | :--------------: | :------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app             | Number or String |   Yes    | The app ID.                                                                                                                                                                                                     |
| updateKey       |      Object      |   Yes    | The unique key of the record to be updated. To specify this field, the field must have the "Prohibit duplicate values" option turned on.                                                                        |
| updateKey.field |      String      |   Yes    | The field code of the unique key.                                                                                                                                                                               |
| updateKey.value | Number or String |   Yes    | The value of the unique key.                                                                                                                                                                                    |
| revision        | Number or String |          | The expected revision number. If the value does not match, an error will occur and the record will not be updated. If the value is not specified or is `-1`, the revision number will not be checked.           |
| record          |      Object      |          | Field codes and values are specified in this object. If ignored, the record will not be updated. For field type specs, check the [Field Types](https://developer.kintone.io/hc/en-us/articles/212494818/) page. |

#### Returns

| Name     |  Type  | Description                          |
| -------- | :----: | ------------------------------------ |
| id       | String | The record ID of the created record. |
| revision | String | The revision number of the record.   |

### getRecords

Retrieves details of multiple records from an app by specifying the app ID and a query string.
The number of records that can be retrieved at once is 500.

#### Parameters

| Name       |       Type       | Required | Description                                                                                                                                                                    |
| ---------- | :--------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| app        | Number or String |   Yes    | The app ID.                                                                                                                                                                    |
| fields     | Array\<String\>  |          | The field codes to be included in the response. Ignoring this parameter will return all accessible fields that exist in the app.                                               |
| query      |      String      |          | The query string that specifies what records to include in the response. <br />Ignoring this parameter will return all accessible records from the app.                        |
| totalCount |     Boolean      |          | If set to `true`, the total count of records that match the query conditions will be included in the response.<br />If ignored, `null` is returned for the `totalCount` value. |

#### Returns

| Name       |       Type       | Description                                                                                                                                                        |
| ---------- | :--------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| records    |      Array       | An array of objects, including field types and field values within the matching records.                                                                           |
| totalCount | String or `null` | The total count of records that match the query conditions.<br />If the `totalCount` parameter is ignored or is set as `false` in the request, `null` is returned. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/360019245194

### getAllRecords

Retrieves details of all records from an app by specifying the app ID, fields, condition, and sort order.
This method can retrieve the records exceeding the [REST API limitation](https://developer.kintone.io/hc/en-us/articles/212495188#limitations).

If you specify `orderBy` parameter, this method uses [`createCursor()`](#createCursor) and [`getRecordsByCursor()`](#getRecordsByCursor) API internally unless you specify `withCursor = false`.

#### Parameters

| Name       |       Type       | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------- | :--------------: | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app        | Number or String |   Yes    | The app ID.                                                                                                                                                                                                                                                                                                                                                                                                          |
| fields     | Array\<String\>  |          | The field codes to be included in the response. Ignoring this parameter will return all accessible fields that exist in the app.                                                                                                                                                                                                                                                                                     |
| condition  |      String      |          | The query that will specify what records will be responded. <br /> Refer to the [Query Operators and Functions](https://developer.kintone.io/hc/en-us/articles/360019245194#optfunc) document for the operators and options that can be specified in the query string. <br /> If ignored, all accessible records from the app will be returned.<br />`order by`, `limit`, and `offset` can not be used in the query. |
| orderBy    |      String      |          | The sort order as a query.<br />Check [Query Options](https://developer.kintone.io/hc/en-us/articles/360019245194#options) for more information on query formats.                                                                                                                                                                                                                                                    |
| withCursor |     Boolean      |          | It indicates whether to use [`createCursor()`](#createCursor) and [`getRecordsByCursor()`](#getRecordsByCursor) internally. The default is `true`.                                                                                                                                                                                                                                                                   |

#### Returns

An array of objects, including field types and field values within the matching records.

### getAllRecordsWithId

Retrieves details of all records from an app by specifying the app ID, fields, and condition.
This method can retrieve the records exceeding the [REST API limitation](https://developer.kintone.io/hc/en-us/articles/212495188#limitations).

#### Parameters

| Name      |       Type       | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------- | :--------------: | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app       | Number or String |   Yes    | The app ID.                                                                                                                                                                                                                                                                                                                                                                                                          |
| fields    | Array\<String\>  |          | The field codes to be included in the response. Ignoring this parameter will return all accessible fields that exist in the app.                                                                                                                                                                                                                                                                                     |
| condition |      String      |          | The query that will specify what records will be responded. <br /> Refer to the [Query Operators and Functions](https://developer.kintone.io/hc/en-us/articles/360019245194#optfunc) document for the operators and options that can be specified in the query string. <br /> If ignored, all accessible records from the app will be returned.<br />`order by`, `limit`, and `offset` can not be used in the query. |

#### Returns

An array of objects, including field types and field values within the matching records.
The returned array is sorted by `id` in ascending order.

### getAllRecordsWithOffset

Retrieves details of all records from an app by specifying the app ID, fields, condition, and sort order.
This method can retrieve the records exceeding the [REST API limitation](https://developer.kintone.io/hc/en-us/articles/212495188#limitations).

#### Parameters

| Name      |       Type       | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------- | :--------------: | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app       | Number or String |   Yes    | The app ID.                                                                                                                                                                                                                                                                                                                                                                                                          |
| fields    | Array\<String\>  |          | The field codes to be included in the response. Ignoring this parameter will return all accessible fields that exist in the app.                                                                                                                                                                                                                                                                                     |
| condition |      String      |          | The query that will specify what records will be responded. <br /> Refer to the [Query Operators and Functions](https://developer.kintone.io/hc/en-us/articles/360019245194#optfunc) document for the operators and options that can be specified in the query string. <br /> If ignored, all accessible records from the app will be returned.<br />`order by`, `limit`, and `offset` can not be used in the query. |
| orderBy   |      String      |          | The sort order as a query.<br />Check [Query Options](https://developer.kintone.io/hc/en-us/articles/360019245194#options) for more information on query formats.                                                                                                                                                                                                                                                    |

#### Returns

An array of objects, including field types and field values within the matching records.

### getAllRecordsWithCursor

Retrieves details of all records from an app by specifying the app ID, fields, and query.
This method uses [`createCursor()`](#createCursor) internally, so an error can be raised by the limitation of the maximum valid cursors per domain.
However, this method can retrieve the records exceeding the limitation of `size` parameter in [`createCursor()`](#createCursor)

#### Parameters

| Name   |       Type       | Required | Description                                                                                                                                                                                                                                                                                                                                     |
| ------ | :--------------: | :------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app    | Number or String |   Yes    | The app ID.                                                                                                                                                                                                                                                                                                                                     |
| fields | Array\<String\>  |          | The field codes to be included in the response. Ignoring this parameter will return all accessible fields that exist in the app.                                                                                                                                                                                                                |
| query  |      String      |          | The query that will specify what records will be responded. <br /> Refer to the [Query Operators and Functions](https://developer.kintone.io/hc/en-us/articles/360019245194#optfunc) document for the operators and options that can be specified in the query string. <br /> If ignored, all accessible records from the app will be returned. |

#### Returns

An array of objects, including field types and field values within the matching records.

### addRecords

Adds multiple records to an app.
The number of records that can be created at once is 100.
If you'd like to add over 100 records, please consider using [addAllRecords](#addAllRecords) instead.

#### Parameters

| Name    |       Type       | Required | Description                                                                                                                                                                                                                                                                                                                                                                              |
| ------- | :--------------: | :------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app     | Number or String |   Yes    | The app ID.                                                                                                                                                                                                                                                                                                                                                                              |
| records |      Array       |   Yes    | Holds an array of record objects, that contains field codes and their values.<br />Up to 100 records can be specified.<br />Fields that are not included in the objects are added with their default value. Objects containing field codes that do not exist are ignored. For field type specs, check the [Field Types](https://developer.kintone.io/hc/en-us/articles/212494818/) page. |

#### Returns

| Name               |      Type       | Description                                                                                                                  |
| ------------------ | :-------------: | ---------------------------------------------------------------------------------------------------------------------------- |
| ids                | Array\<String\> | The record IDs of the created records.<br />This property is for backward compatibility. We might remove this in the future. |
| revisions          | Array\<String\> | The revision numbers of the records.<br />This property is for backward compatibility. We might remove this in the future.   |
| records            |      Array      | Holds an array of objects that include `id` and `revision` of created records.                                               |
| records[].id       |     String      | The ID of the record.                                                                                                        |
| records[].revision |     String      | The revision number of the record.                                                                                           |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/360000313321

### addAllRecords

Adds multiple records to an app.
This method can add unlimited number of records. This method could throw `KintoneAllRecordsError` if an error occurred. Please see [KintoneAllRecordsError](errorHandling.md#KintoneAllRecordsError).

:warning: **This method split the records into chunks of 2000 records and processes each chunk sequentially. Rollback can be performed on each chunk of 2000 records.  
For more information, please see [an example of KintoneAllRecordsError](errorHandling.md#Example-of-KintoneAllRecordsError).**

#### Parameters

| Name    |       Type       | Required | Description                                                                                                                                                                                                                                                                                                                                                                             |
| ------- | :--------------: | :------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app     | Number or String |   Yes    | The app ID.                                                                                                                                                                                                                                                                                                                                                                             |
| records |      Array       |   Yes    | Holds an array of record objects, that contains field codes and their values.<br />Over 100 records can be specified.<br />Fields that are not included in the objects are added with their default value. Objects containing field codes that do not exist are ignored. For field type specs, check the [Field Types](https://developer.kintone.io/hc/en-us/articles/212494818/) page. |

#### Returns

| Name               |  Type  | Description                                                                    |
| ------------------ | :----: | ------------------------------------------------------------------------------ |
| records            | Array  | Holds an array of objects that include `id` and `revision` of created records. |
| records[].id       | String | The ID of the record.                                                          |
| records[].revision | String | The revision number of the record.                                             |

### updateRecords

Updates details of multiple records in an app, by specifying their record numbers, or their unique keys.
The number of records that can be updated at once is 100.
If you'd like to update over 100 records, please consider using [updateAllRecords](#updateAllRecords) instead.

#### Parameters

| Name                      |       Type       |          Required           | Description                                                                                                                                                                                                     |
| ------------------------- | :--------------: | :-------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app                       | Number or String |             Yes             | The app ID.                                                                                                                                                                                                     |
| records                   |      Array       |             Yes             | Holds an array of objects that include `id`/`updateKey`, `revision` and `record` objects.<br />Up to 100 records can be specified.                                                                              |
| records[].id              | Number or String | Conditionally<br />Required | The record ID of the record to be updated. Required, if `updateKey` will not be specified.                                                                                                                      |
| records[].updateKey       |      Object      | Conditionally<br />Required | The unique key of the record to be updated. Required, if `id` will not be specified. To specify this field, the field must have the "Prohibit duplicate values" option turned on.                               |
| records[].updateKey.field |      String      | Conditionally<br />Required | The field code of the unique key. Required, if `updateKey` will be specified.                                                                                                                                   |
| records[].updateKey.value | Number or String | Conditionally<br />Required | The value of the unique key. Required, if `updateKey` will be specified.                                                                                                                                        |
| records[].revision        | Number or String |                             | The expected revision number. If the value does not match, an error will occur and all records will not be updated. If the value is not specified or is `-1`, the revision number will not be checked.          |
| records[].record          |      Object      |                             | Field codes and values are specified in this object. If ignored, the record will not be updated. For field type specs, check the [Field Types](https://developer.kintone.io/hc/en-us/articles/212494818/) page. |

#### Returns

| Name               |  Type  | Description                                                                    |
| ------------------ | :----: | ------------------------------------------------------------------------------ |
| records            | Array  | Holds an array of objects that include `id` and `revision` of updated records. |
| records[].id       | String | The ID of the record.                                                          |
| records[].revision | String | The revision number of the record.                                             |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/360000313622

### updateAllRecords

Updates multiple records in an app.
This method can update unlimited number of records. This method could throw `KintoneAllRecordsError` if an error occurred. Please see [KintoneAllRecordsError](errorHandling.md#KintoneAllRecordsError).

:warning: **This method split the records into chunks of 2000 records and processes each chunk sequentially. Rollback can be performed on each chunk of 2000 records.
For more information, please see [an example of KintoneAllRecordsError](errorHandling.md#Example-of-KintoneAllRecordsError).**

#### Parameters

| Name                      |       Type       |          Required           | Description                                                                                                                                                                                                     |
| ------------------------- | :--------------: | :-------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app                       | Number or String |             Yes             | The app ID.                                                                                                                                                                                                     |
| records                   |      Array       |             Yes             | Holds an array of objects that include `id`/`updateKey`, `revision` and `record` objects.<br />Over 100 records can be specified.                                                                               |
| records[].id              | Number or String | Conditionally<br />Required | The record ID of the record to be updated. Required, if `updateKey` will not be specified.                                                                                                                      |
| records[].updateKey       |      Object      | Conditionally<br />Required | The unique key of the record to be updated. Required, if `id` will not be specified. To specify this field, the field must have the "Prohibit duplicate values" option turned on.                               |
| records[].updateKey.field |      String      | Conditionally<br />Required | The field code of the unique key. Required, if `updateKey` will be specified.                                                                                                                                   |
| records[].updateKey.value | Number or String | Conditionally<br />Required | The value of the unique key. Required, if `updateKey` will be specified.                                                                                                                                        |
| records[].revision        | Number or String |                             | The expected revision number. If the value does not match, an error will occur. If the value is not specified or is `-1`, the revision number will not be checked.                                              |
| records[].record          |      Object      |                             | Field codes and values are specified in this object. If ignored, the record will not be updated. For field type specs, check the [Field Types](https://developer.kintone.io/hc/en-us/articles/212494818/) page. |

#### Returns

| Name               |  Type  | Description                                                                    |
| ------------------ | :----: | ------------------------------------------------------------------------------ |
| records            | Array  | Holds an array of objects that include `id` and `revision` of updated records. |
| records[].id       | String | The ID of the record.                                                          |
| records[].revision | String | The revision number of the record.                                             |

### deleteRecords

Deletes multiple records in an app.

#### Parameters

| Name      |           Type            | Required | Description                                                                                                                                                                                                                                                                                                                                                                                              |
| --------- | :-----------------------: | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app       |     Number or String      |   Yes    | The app ID.                                                                                                                                                                                                                                                                                                                                                                                              |
| ids       | Array\<Number or String\> |   Yes    | Array of record IDs that will be deleted.<br />Up to 100 records can be specified.                                                                                                                                                                                                                                                                                                                       |
| revisions | Array\<Number or String\> |          | The expected revision number.<br />The first id number will correspond to the first revision number in the array, the second id to the second revision number, and so on.<br />If the revision number does not match, an error will occur and no records will be deleted.<br />If the revision number is left blank or is `-1`, the revision number will not be checked for the corresponding record ID. |

#### Returns

An empty object.

#### Reference

- https://developer.kintone.io/hc/en-us/articles/212494558

### deleteAllRecords

Deletes multiple records in an app.
This method can delete unlimited number of records. This method could throw `KintoneAllRecordsError` if an error occurred. Please see [KintoneAllRecordsError](errorHandling.md#KintoneAllRecordsError).

:warning: **This method split the records into chunks of 2000 records and processes each chunk sequentially. Rollback can be performed on each chunk of 2000 records.
For more information, please see [an example of KintoneAllRecordsError](errorHandling.md#Example-of-KintoneAllRecordsError).**

#### Parameters

| Name               |       Type       | Required | Description                                                                                                                                                        |
| ------------------ | :--------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| app                | Number or String |   Yes    | The app ID.                                                                                                                                                        |
| records            |      Array       |   Yes    | Holds an array of objects that include `id` and `revision`.<br />Over 100 records can be specified.                                                                |
| records[].id       | Number or String |   Yes    | The record ID of the record to be deleted.                                                                                                                         |
| records[].revision | Number or String |          | The expected revision number. If the value does not match, an error will occur. If the value is not specified or is `-1`, the revision number will not be checked. |

#### Returns

An empty object.

### getRecordComments

Retrieves multiple comments from a record in an app.

#### Parameters

| Name   |       Type       | Required | Description                                                                                                                                                                       |
| ------ | :--------------: | :------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app    | Number or String |   Yes    | The app ID.                                                                                                                                                                       |
| record | Number or String |   Yes    | The record ID.                                                                                                                                                                    |
| order  |      String      |          | The sort order of the comment ID. Specifying "asc" will sort the comments in ascending order, and "desc" will sort the comments in descending order.                              |
| offset |      Number      |          | This skips the retrieval of the first number of comments.<br />"offset": 30 skips the first 30 comments, and retrieves from the 31st comment. There is no maximum for this value. |
| limit  |      Number      |          | The number of records to retrieve.<br />"limit": 5 will retrieve the first 5 comments. The default and maximum is 10 comments.                                                    |

#### Returns

| Name                       |  Type   | Description                                                                                                                              |
| -------------------------- | :-----: | ---------------------------------------------------------------------------------------------------------------------------------------- |
| comments                   |  Array  | An array of comments. An empty array is returned if no conditions are met.                                                               |
| comments[].id              | String  | The comment ID.                                                                                                                          |
| comments[].text            | String  | The comment including the line feed codes.<br />If a user is mentioned within a comment, the "@" symbol will be omitted from the String. |
| comments[].createdAt       | String  | The created date and time of the comment.                                                                                                |
| comments[].creator         | Object  | An object including information of the comment creator.                                                                                  |
| comments[].creator.code    | String  | The comment creator's user code (log in name).                                                                                           |
| comments[].creator.name    | String  | The comment creator's user name (display name).                                                                                          |
| comments[].mentions        |  Array  | An array including information of mentioned users.                                                                                       |
| comments[].mentions[].code | String  | The code of the mentioned user, group or organization.                                                                                   |
| comments[].mentions[].type | String  | The type of the mention.<ul><li>`USER`: User</li><li>`GROUP`: Group</li><li> `ORGANIZATION`: Department</li></ul>                        |
| older                      | Boolean | It indicates whether older comments exist.                                                                                               |
| newer                      | Boolean | It indicates whether newer comments exist.                                                                                               |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/219105188

### addRecordComment

Add a comment to a record in an app.

#### Parameters

| Name                    |       Type       | Required | Description                                                                                                                                                                                   |
| ----------------------- | :--------------: | :------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app                     | Number or String |   Yes    | The app ID.                                                                                                                                                                                   |
| record                  | Number or String |   Yes    | The record ID.                                                                                                                                                                                |
| comment                 |      Object      |   Yes    | An object including comment details.                                                                                                                                                          |
| comment.text            |      String      |   Yes    | The comment text. The maximum characters of the comment is 65535.                                                                                                                             |
| comment.mentions        |      Array       |          | An array including information to mention other users.                                                                                                                                        |
| comment.mentions[].code |      String      |          | The code the user, group or organization that will be mentioned. The maximum number of mentions is 10. The mentioned users will be placed in front of the comment text when the API succeeds. |
| comment.mentions[].type |      String      |          | The type of the mentioned target.<ul><li>`USER`: User</li><li>`GROUP`: Group</li><li> `ORGANIZATION`: Department</li></ul>                                                                    |

#### Returns

| Name |  Type  | Description     |
| ---- | :----: | --------------- |
| id   | String | The comment ID. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/219501367

### deleteRecordComment

Delete a comment in a record in an app.

#### Parameters

| Name    |       Type       | Required | Description     |
| ------- | :--------------: | :------: | --------------- |
| app     | Number or String |   Yes    | The app ID.     |
| record  | Number or String |   Yes    | The record ID.  |
| comment | Number or String |   Yes    | The comment ID. |

#### Returns

An empty object.

#### Reference

- https://developer.kintone.io/hc/en-us/articles/219562607

### createCursor

Adds a cursor so that large amount of records can be obtained from an app.

#### Parameters

| Name   |       Type       | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------ | :--------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app    | Number or String |   Yes    | The app ID.                                                                                                                                                                                                                                                                                                                                                                                                         |
| fields | Array\<String\>  |          | The field codes to be included in the response when using the [`getRecordsByCursor()`](#getRecordsByCursor). <br /> If ignored, all accessible fields in the app will be returned.                                                                                                                                                                                                                                  |
| query  |      String      |          | The query string that will specify what records will be responded when using the [`getRecordsByCursor()`](#getRecordsByCursor). <br /> Refer to the [Query Operators and Functions](https://developer.kintone.io/hc/en-us/articles/360019245194#optfunc) document for the operators and options that can be specified in the query string. <br /> If ignored, all accessible records from the app will be returned. |
| size   | Number or String |          | The maximum number of records the [`getRecordsByCursor()`](#getRecordsByCursor) can retrieve from this cursor with one request. <br /> The maximum number is 500 records. If ignored, the default number of records to be retrieved is 100.                                                                                                                                                                         |

#### Returns

| Name       |  Type  | Description                                                 |
| ---------- | :----: | ----------------------------------------------------------- |
| id         | String | The cursor ID.                                              |
| totalCount | String | The total count of records that match the query conditions. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/360000280322

### getRecordsByCursor

Retrieves multiple records from an app by specifying the cursor ID.

#### Parameters

| Name |  Type  | Required | Description    |
| ---- | :----: | :------: | -------------- |
| id   | String |   Yes    | The cursor ID. |

#### Returns

| Name    |  Type   | Description                                                                                                                                                                                                                                                                                                     |
| ------- | :-----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| records |  Array  | An array of objects that includes field data of records that match the query. <br /> The response is the same as the response for the [`getRecords()`](#getRecords).                                                                                                                                            |
| next    | Boolean | States whether there are more records that can be acquired from the cursor. <br /> It indicates whether records to be acquired are still exist. <br /> Run this API again with the same parameters to obtain the next set of records. <br /> The cursor will remain valid until all records have been obtained. |

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

### updateRecordAssignees

Updates the assignees of a record status, that was set with the [Process Management feature](https://get.kintone.help/hc/en-us/articles/115001510908-Configuring-Process-Management).

#### Parameters

| Name      |       Type       | Required | Description                                                                                                                                                                                                                                      |
| --------- | :--------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| app       | Number or String |   Yes    | The app ID.                                                                                                                                                                                                                                      |
| id        | Number or String |   Yes    | The record ID.                                                                                                                                                                                                                                   |
| assignees | Array\<string\>  |   Yes    | The user code(s) (log in names) of the assignee(s). If empty, no users will be assigned. The maximum number of assignees is 100.                                                                                                                 |
| revision  | Number or String |          | The revision number of the record before updating the assignees. If the specified revision is not the latest revision, the request will result in an error. The revision will not be checked if this parameter is ignored, or `-1` is specified. |

#### Returns

| Name     |  Type  | Description                                                     |
| -------- | :----: | --------------------------------------------------------------- |
| revision | String | The revision number of the record after updating the assignees. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/219563427

### updateRecordStatus

Updates the status of a record of an app, that was set with the [Process Management feature](https://get.kintone.help/hc/en-us/articles/115001510908-Configuring-Process-Management).

#### Parameters

| Name     |       Type       |          Required           | Description                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------- | :--------------: | :-------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| action   |      String      |             Yes             | The action name of the action to run. <br /> If the localization feature has been used to apply multiple translations of the action name, specify the name of the action in the language settings of the user that will run the API. API tokens follow the language settings set in the [Localization page](https://get.kintone.help/hc/en-us/articles/115001461367-Localization) of the User & System Administration settings. |
| app      | Number or String |             Yes             | The app ID.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| assignee |      String      | Conditionally<br />Required | The next assignee. Specify the assignee's log in name. <br /> Required, if the "_Assignee List_" of the current status is set to "_User chooses one assignee from the list to take action_", and a selectable assignee exists.                                                                                                                                                                                                  |
| id       | Number or String |             Yes             | The record ID.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| revision | Number or String |                             | The revision number of the record before updating the status. <br /> If the specified revision is not the latest revision, the request will result in an error. <br /> The revision will not be checked if this parameter is ignored, or `-1` is specified.                                                                                                                                                                     |

#### Returns

| Name     |  Type  | Description                                                                                                                                                                                |
| -------- | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| revision | String | The revision number of the record after updating the status. <br /> The revision number will increase by 2, as two operations are preformed - running the action, and updating the status. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/213149747

### ️updateRecordsStatus

Updates the statuses of multiple records of an app, that were set with the [Process Management feature](https://get.kintone.help/hc/en-us/articles/115001510908-Configuring-Process-Management).

#### Parameters

| Name               |       Type       | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------ | :--------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app                |      String      |   Yes    | The app ID.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| records            |      Array       |   Yes    | An array including information of the record to be updated. Up to 100 records can be specified.                                                                                                                                                                                                                                                                                                                                 |
| records[].action   |      String      |   Yes    | The action name of the action to run. <br /> If the localization feature has been used to apply multiple translations of the action name, specify the name of the action in the language settings of the user that will run the API. API tokens follow the language settings set in the [Localization page](https://get.kintone.help/hc/en-us/articles/115001461367-Localization) of the User & System Administration settings. |
| records[].assignee |      String      |          | The next assignee. Specify the assignee's log in name.                                                                                                                                                                                                                                                                                                                                                                          |
| records[].id       | Number or String |   Yes    | The record ID.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| records[].revision | Number or String |          | The revision number of the record before updating the status. <br /> If the specified revision is not the latest revision, the request will result in an error. <br /> The revision will not be checked if this parameter is ignored, or `-1` is specified.                                                                                                                                                                     |

#### Returns

| Name               |  Type  | Description                                                                                                                                                                                |
| ------------------ | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| records            | Array  | An array including information of the updated records.                                                                                                                                     |
| records[].id       | String | The record ID                                                                                                                                                                              |
| records[].revision | String | The revision number of the record after updating the status. <br /> The revision number will increase by 2, as two operations are preformed - running the action, and updating the status. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/360000334541
