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
      await client.search.search({
        query: [{ operator: "AND", keywords: ["Tokyo Trading"] }],
      }),
    );
  } catch (error) {
    console.log(error);
  }
})();
```

- All methods are defined on the `search` property.
- This method returns a Promise object that is resolved with an object having properties in each `Returns` section.

## Methods

### search

Performs a global search across kintone records, comments, spaces, threads, attachments, and other resources that the signed-in user has permission to view.

#### Parameters

| Name             |       Type       | Required | Description                                                                                                                                                                                                            |
| ---------------- | :--------------: | :------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| query            |      Array       |   Yes    | The list of search conditions, joined with AND. Must include at least one entry whose `operator` is `AND`.                                                                                                             |
| query[].operator |      String      |   Yes    | `AND` (the result must include the keywords) or `NOT` (the result must not include the keywords).                                                                                                                      |
| query[].keywords |      Array       |   Yes    | Search keywords joined with AND. Each keyword can be up to 50 characters and the total number of keywords across `query` can be up to 20.                                                                              |
| types            |      Array       |          | The hit types to include. One or more of `RECORD`, `RECORD_COMMENT`, `SPACE`, `THREAD`, `THREAD_COMMENT`, `PEOPLE_COMMENT`, `MESSAGE_COMMENT`, `ATTACHMENT`. If omitted, `null`, or empty, all hit types are returned. |
| scopes           |      Array       |          | The list of scopes to include, joined with OR. Up to 20 entries.                                                                                                                                                       |
| scopes[].scope   |      String      |   Yes    | One of `SPACE`, `APP`, `PEOPLE`, `MESSAGE`.                                                                                                                                                                            |
| scopes[].ids     |      Array       |          | App IDs (when `scope` is `APP`) or space IDs (when `scope` is `SPACE`). Up to 20 entries. Specifying `ids` with other scopes is an error.                                                                              |
| scopes[].codes   |      Array       |          | User codes for the people page (when `scope` is `PEOPLE`) or for the message recipient (when `scope` is `MESSAGE`). Up to 20 entries. Specifying `codes` with other scopes is an error.                                |
| excludeScopes    |      Array       |          | The list of scopes to exclude, joined with AND. Same shape as `scopes`. Up to 20 entries.                                                                                                                              |
| createdAfter     |      String      |          | Lower bound (inclusive) on the creation datetime. Uses the kintone REST API datetime format.                                                                                                                           |
| createdBefore    |      String      |          | Upper bound (inclusive) on the creation datetime. Must be greater than or equal to `createdAfter`.                                                                                                                     |
| creators         |      Array       |          | User codes of creators, joined with OR. Up to 20 entries.                                                                                                                                                              |
| sort             |      Object      |          | Sort condition. Defaults to `{ by: "RELEVANCE", order: "DESC" }`. The combination `{ by: "RELEVANCE", order: "ASC" }` is an error.                                                                                     |
| sort.by          |      String      |          | `RELEVANCE` (default) or `CREATED_AT`.                                                                                                                                                                                 |
| sort.order       |      String      |          | `ASC` or `DESC` (default).                                                                                                                                                                                             |
| limit            | Number or String |          | The maximum number of hits to return. Between 1 and 20. Defaults to 20.                                                                                                                                                |
| pageToken        |      String      |          | Pagination token. Pass the `nextPageToken` from the previous response to retrieve the next page. If omitted, `null`, or an empty string, the first page is returned.                                                   |

#### Returns

| Name                  |  Type  | Description                                                                                                                                                                                                                                       |
| --------------------- | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| hits                  | Array  | The list of search hits.                                                                                                                                                                                                                          |
| hits[].type           | String | The hit type. One of `RECORD`, `RECORD_COMMENT`, `SPACE`, `THREAD`, `THREAD_COMMENT`, `PEOPLE_COMMENT`, `MESSAGE_COMMENT`, `ATTACHMENT`.                                                                                                          |
| hits[].url            | String | The URL to the hit. For `ATTACHMENT`, the URL of the attachment's parent.                                                                                                                                                                         |
| hits[].snippets       | Array  | Up to three text snippets that contain the matched keywords.                                                                                                                                                                                      |
| hits[].record         | Object | Present when `type` is `RECORD`, or when `type` is `ATTACHMENT` and `attachment.attachedTo` is `RECORD`. Contains `appId`, `appName`, `recordId`, `recordTitle`, `createdAt`, `creator`, `matchedFields`, and optionally `spaceId` / `spaceName`. |
| hits[].recordComment  | Object | Present when `type` is `RECORD_COMMENT`. Contains `appId`, `appName`, `recordId`, `recordTitle`, `commentId`, `createdAt`, `creator`, and optionally `spaceId` / `spaceName`.                                                                     |
| hits[].space          | Object | Present when `type` is `SPACE`, or when `type` is `ATTACHMENT` and `attachment.attachedTo` is `SPACE`. Contains `spaceId`, `spaceName`, `createdAt`, and `creator`.                                                                               |
| hits[].thread         | Object | Present when `type` is `THREAD`, or when `type` is `ATTACHMENT` and `attachment.attachedTo` is `THREAD`. Contains `threadId`, `threadName`, `spaceId`, `spaceName`, `createdAt`, and `creator`.                                                   |
| hits[].threadComment  | Object | Present when `type` is `THREAD_COMMENT`, or when `type` is `ATTACHMENT` and `attachment.attachedTo` is `THREAD_COMMENT`. Contains `commentId`, optional `replyId`, `spaceId`, `spaceName`, `threadId`, `threadName`, `createdAt`, and `creator`.  |
| hits[].peopleComment  | Object | Present when `type` is `PEOPLE_COMMENT`, or when `type` is `ATTACHMENT` and `attachment.attachedTo` is `PEOPLE_COMMENT`. Contains `commentId`, optional `replyId`, `owner`, `createdAt`, and `creator`.                                           |
| hits[].messageComment | Object | Present when `type` is `MESSAGE_COMMENT`, or when `type` is `ATTACHMENT` and `attachment.attachedTo` is `MESSAGE_COMMENT`. Contains `commentId`, `recipient`, `createdAt`, and `creator`.                                                         |
| hits[].attachment     | Object | Present when `type` is `ATTACHMENT`. Contains `attachedTo` (`RECORD`, `SPACE`, `THREAD`, `THREAD_COMMENT`, `PEOPLE_COMMENT`, `MESSAGE_COMMENT`), `fileKey`, `name`, `createdAt`, and `creator`.                                                   |
| nextPageToken         | String | Token to retrieve the next page. Absent on the last page.                                                                                                                                                                                         |

#### Notes

- Results are limited to data the signed-in user has permission to view (app, record, field, space, and message permissions are all enforced).
- Guest users can call this API; results are restricted to data inside guest spaces they belong to.
- Snippet content and length may change as search quality is improved.
- The same record may appear in multiple hits (for example, once as `RECORD` and once as `ATTACHMENT`).
