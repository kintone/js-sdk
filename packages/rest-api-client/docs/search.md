# Search

> [!NOTE]
> This API is part of the kintone API Lab. The endpoint and parameters may change without notice until it is officially released.

- [search](#search)

## Overview

```ts
const client = new KintoneRestAPIClient();

(async () => {
  try {
    console.log(
      await client.search({
        query: [{ operator: "AND", keywords: ["Tokyo Trading"] }],
      }),
    );
  } catch (error) {
    console.log(error);
  }
})();
```

- The `search` method is defined directly on the `KintoneRestAPIClient` instance.
- This method returns a Promise object that is resolved with an object having properties in each `Returns` section.

## Methods

### search

Performs a global search across kintone records, comments, spaces, threads, attachments, and other resources that the signed-in user has permission to view.

#### Parameters

| Name             |       Type       | Required | Description                                                                                                                                                                                                                                                       |
| ---------------- | :--------------: | :------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| query            |      Array       |   Yes    | The list of search conditions, joined with AND. Must include at least one entry whose `operator` is `AND`.                                                                                                                                                        |
| query[].operator |      String      |   Yes    | `AND` (the result must include the keywords) or `NOT` (the result must not include the keywords).                                                                                                                                                                 |
| query[].keywords |      Array       |   Yes    | Search keywords joined with AND. Each keyword can be up to 50 characters and the total number of keywords across `query` can be up to 20.                                                                                                                         |
| types            |      Array       |          | The hit types to include. One or more of `RECORD`, `RECORD_COMMENT`, `SPACE`, `THREAD`, `THREAD_COMMENT`, `PEOPLE_COMMENT`, `MESSAGE_COMMENT`, `ATTACHMENT`. If omitted, `null`, or empty, all hit types are returned.                                            |
| scopes           |      Array       |          | The list of scopes to include, joined with OR. Up to 20 entries. If omitted, `null`, or empty, all scopes are included.                                                                                                                                           |
| scopes[].scope   |      String      |   Yes    | One of `SPACE`, `APP`, `PEOPLE`, `MESSAGE`.                                                                                                                                                                                                                       |
| scopes[].ids     |      Array       |          | App IDs (when `scope` is `APP`) or space IDs (when `scope` is `SPACE`). Up to 20 entries. If omitted, `null`, or empty, no ID filter is applied within the scope. Specifying `ids` with other scopes is an error.                                                 |
| scopes[].codes   |      Array       |          | User codes for the people page (when `scope` is `PEOPLE`) or for the message recipient (when `scope` is `MESSAGE`). Up to 20 entries. If omitted, `null`, or empty, no code filter is applied within the scope. Specifying `codes` with other scopes is an error. |
| excludeScopes    |      Array       |          | The list of scopes to exclude, joined with AND. Same shape as `scopes`. Up to 20 entries. If omitted, `null`, or empty, no scopes are excluded.                                                                                                                   |
| createdAfter     |  String or Date  |          | Lower bound (inclusive) on the creation datetime. Accepts either a kintone REST API datetime string or a JavaScript `Date` (converted via `toISOString()`).                                                                                                       |
| createdBefore    |  String or Date  |          | Upper bound (inclusive) on the creation datetime. Must be greater than or equal to `createdAfter`. Accepts either a string or a `Date`.                                                                                                                           |
| creators         |      Array       |          | User codes of creators, joined with OR. Up to 20 entries. If omitted, `null`, or empty, hits from all creators are returned.                                                                                                                                      |
| sort             |      Object      |          | Sort condition. Defaults to `{ by: "RELEVANCE", order: "DESC" }`. The combination `{ by: "RELEVANCE", order: "ASC" }` is an error.                                                                                                                                |
| sort.by          |      String      |          | `RELEVANCE` (default) or `CREATED_AT`.                                                                                                                                                                                                                            |
| sort.order       |      String      |          | `ASC` or `DESC` (default).                                                                                                                                                                                                                                        |
| limit            | Number or String |          | The maximum number of hits to return. Between 1 and 20. Defaults to 20.                                                                                                                                                                                           |
| pageToken        |      String      |          | Pagination token. Pass the `nextPageToken` from the previous response to retrieve the next page. If omitted, `null`, or an empty string, the first page is returned.                                                                                              |

#### Returns

| Name                  |  Type  | Description                                                                                                                                                       |
| --------------------- | :----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| hits                  | Array  | The list of search hits.                                                                                                                                          |
| hits[].type           | String | The hit type. One of `RECORD`, `RECORD_COMMENT`, `SPACE`, `THREAD`, `THREAD_COMMENT`, `PEOPLE_COMMENT`, `MESSAGE_COMMENT`, `ATTACHMENT`.                          |
| hits[].url            | String | The URL to the hit. For `ATTACHMENT`, the URL of the attachment's parent.                                                                                         |
| hits[].snippets       | Array  | Up to 3 text snippets that contain the matched keywords.                                                                                                          |
| hits[].record         | Object | Present when `type` is `RECORD`, or when `type` is `ATTACHMENT` and `attachment.attachedTo` is `RECORD`. See [record](#record).                                   |
| hits[].recordComment  | Object | Present when `type` is `RECORD_COMMENT`. See [recordComment](#recordcomment).                                                                                     |
| hits[].space          | Object | Present when `type` is `SPACE`, or when `type` is `ATTACHMENT` and `attachment.attachedTo` is `SPACE`. See [space](#space).                                       |
| hits[].thread         | Object | Present when `type` is `THREAD`, or when `type` is `ATTACHMENT` and `attachment.attachedTo` is `THREAD`. See [thread](#thread).                                   |
| hits[].threadComment  | Object | Present when `type` is `THREAD_COMMENT`, or when `type` is `ATTACHMENT` and `attachment.attachedTo` is `THREAD_COMMENT`. See [threadComment](#threadcomment).     |
| hits[].peopleComment  | Object | Present when `type` is `PEOPLE_COMMENT`, or when `type` is `ATTACHMENT` and `attachment.attachedTo` is `PEOPLE_COMMENT`. See [peopleComment](#peoplecomment).     |
| hits[].messageComment | Object | Present when `type` is `MESSAGE_COMMENT`, or when `type` is `ATTACHMENT` and `attachment.attachedTo` is `MESSAGE_COMMENT`. See [messageComment](#messagecomment). |
| hits[].attachment     | Object | Present when `type` is `ATTACHMENT`. See [attachment](#attachment).                                                                                               |
| nextPageToken         | String | Token to retrieve the next page. Absent on the last page.                                                                                                         |

##### record

| Name          |  Type  | Description                                                                          |
| ------------- | :----: | ------------------------------------------------------------------------------------ |
| appId         | String | The app ID.                                                                          |
| appName       | String | The app name.                                                                        |
| recordId      | String | The record ID.                                                                       |
| recordTitle   | String | The record title.                                                                    |
| createdAt     | String | The creation datetime.                                                               |
| creator       | Object | The record creator. See [user](#user).                                               |
| matchedFields | Array  | Up to 3 fields whose values matched the keywords. See [matchedField](#matchedfield). |
| spaceId       | String | The space ID. Present only when the app belongs to a space.                          |
| spaceName     | String | The space name. Present only when the app belongs to a space.                        |

##### recordComment

| Name        |  Type  | Description                                                   |
| ----------- | :----: | ------------------------------------------------------------- |
| appId       | String | The app ID.                                                   |
| appName     | String | The app name.                                                 |
| recordId    | String | The record ID.                                                |
| recordTitle | String | The record title.                                             |
| commentId   | String | The comment ID.                                               |
| createdAt   | String | The creation datetime of the comment.                         |
| creator     | Object | The comment author. See [user](#user).                        |
| spaceId     | String | The space ID. Present only when the app belongs to a space.   |
| spaceName   | String | The space name. Present only when the app belongs to a space. |

##### space

| Name      |  Type  | Description                           |
| --------- | :----: | ------------------------------------- |
| spaceId   | String | The space ID.                         |
| spaceName | String | The space name.                       |
| createdAt | String | The creation datetime of the space.   |
| creator   | Object | The space creator. See [user](#user). |

##### thread

| Name       |  Type  | Description                            |
| ---------- | :----: | -------------------------------------- |
| spaceId    | String | The space ID that contains the thread. |
| spaceName  | String | The space name.                        |
| threadId   | String | The thread ID.                         |
| threadName | String | The thread name.                       |
| createdAt  | String | The creation datetime of the thread.   |
| creator    | Object | The thread creator. See [user](#user). |

##### threadComment

| Name       |  Type  | Description                                                                                                   |
| ---------- | :----: | ------------------------------------------------------------------------------------------------------------- |
| commentId  | String | When this entry is a comment, its own ID. When this entry is a reply, the ID of the comment being replied to. |
| replyId    | String | Absent when this entry is a comment. Present only when this entry is a reply, holding the reply's own ID.     |
| spaceId    | String | The space ID that contains the thread.                                                                        |
| spaceName  | String | The space name.                                                                                               |
| threadId   | String | The thread ID.                                                                                                |
| threadName | String | The thread name.                                                                                              |
| createdAt  | String | The creation datetime of the comment.                                                                         |
| creator    | Object | The comment author. See [user](#user).                                                                        |

##### peopleComment

| Name      |  Type  | Description                                                                                                   |
| --------- | :----: | ------------------------------------------------------------------------------------------------------------- |
| commentId | String | When this entry is a comment, its own ID. When this entry is a reply, the ID of the comment being replied to. |
| replyId   | String | Absent when this entry is a comment. Present only when this entry is a reply, holding the reply's own ID.     |
| owner     | Object | The owner of the people page. See [user](#user).                                                              |
| createdAt | String | The creation datetime of the comment.                                                                         |
| creator   | Object | The comment author. See [user](#user).                                                                        |

##### messageComment

| Name      |  Type  | Description                                      |
| --------- | :----: | ------------------------------------------------ |
| commentId | String | The comment ID.                                  |
| recipient | Object | The recipient of the message. See [user](#user). |
| createdAt | String | The creation datetime of the comment.            |
| creator   | Object | The comment author. See [user](#user).           |

##### attachment

| Name       |  Type  | Description                                                                                                                              |
| ---------- | :----: | ---------------------------------------------------------------------------------------------------------------------------------------- |
| attachedTo | String | The kind of resource the file is attached to. One of `RECORD`, `SPACE`, `THREAD`, `THREAD_COMMENT`, `PEOPLE_COMMENT`, `MESSAGE_COMMENT`. |
| fileKey    | String | The file key.                                                                                                                            |
| name       | String | The file name.                                                                                                                           |
| createdAt  | String | The creation datetime of the attachment.                                                                                                 |
| creator    | Object | The uploader. See [user](#user).                                                                                                         |

##### user

| Name |  Type  | Description       |
| ---- | :----: | ----------------- |
| code | String | The user code.    |
| name | String | The display name. |

##### matchedField

| Name |  Type  | Description                    |
| ---- | :----: | ------------------------------ |
| code | String | The field code.                |
| name | String | The display name of the field. |

#### Notes

- Results are limited to data the signed-in user has permission to view (app, record, field, space, and message permissions are all enforced).
- Guest users can call this API; results are restricted to data inside guest spaces they belong to.
- Snippet content and length may change as search quality is improved.
- The same record may appear in multiple hits (for example, once as `RECORD` and once as `ATTACHMENT`).
