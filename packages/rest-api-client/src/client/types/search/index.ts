export type SearchHitType =
  | "RECORD"
  | "RECORD_COMMENT"
  | "SPACE"
  | "THREAD"
  | "THREAD_COMMENT"
  | "PEOPLE_COMMENT"
  | "MESSAGE_COMMENT"
  | "ATTACHMENT";

export type SearchAttachmentTarget =
  | "RECORD"
  | "SPACE"
  | "THREAD"
  | "THREAD_COMMENT"
  | "PEOPLE_COMMENT"
  | "MESSAGE_COMMENT";

export type SearchScopeType = "SPACE" | "APP" | "PEOPLE" | "MESSAGE";

export type SearchSortBy = "RELEVANCE" | "CREATED_AT";
export type SearchSortOrder = "ASC" | "DESC";

/**
 * A single search condition. `query` is AND-joined as a whole, while each
 * entry's `operator` describes how its `keywords` are matched. If no entry
 * has `operator` set to `AND` or `OR`, the API returns an empty result set.
 */
export type SearchQuery = {
  operator: "AND" | "OR" | "NOT";
  keywords: string[];
};

type AppID = number | string;
type SpaceID = number | string;

export type SearchScope =
  | { scope: "SPACE"; ids?: SpaceID[] | null }
  | { scope: "APP"; ids?: AppID[] | null }
  | { scope: "PEOPLE"; codes?: string[] | null }
  | { scope: "MESSAGE"; codes?: string[] | null };

/**
 * Sort condition. Defaults to `{ by: "RELEVANCE", order: "DESC" }`.
 * The combination `{ by: "RELEVANCE", order: "ASC" }` is rejected by the
 * API, so the union forbids it at the type level: when `by` is omitted or
 * `"RELEVANCE"`, only `order: "DESC"` is allowed.
 */
export type SearchSort =
  | { by?: "RELEVANCE"; order?: "DESC" }
  | { by: "CREATED_AT"; order?: SearchSortOrder };

export type SearchRequest = {
  /**
   * One or more search conditions. The non-empty tuple type reflects the
   * API's requirement that `query` itself must be present and non-empty
   * (a CB_VA01 error otherwise). Note that the rev-38 "no AND/OR ⇒ empty
   * result" relaxation only applies once `query` has at least one entry.
   */
  query: [SearchQuery, ...SearchQuery[]];
  types?: SearchHitType[] | null;
  scopes?: SearchScope[] | null;
  excludeScopes?: SearchScope[] | null;
  createdAfter?: string | Date;
  createdBefore?: string | Date;
  creators?: string[] | null;
  sort?: SearchSort;
  limit?: number | string;
  pageToken?: string | null;
};

export type SearchUser = { code: string; name: string };

type SearchHitBase = {
  url: string;
  snippets: string[];
};

export type SearchHitRecord = {
  appId: string;
  appName: string;
  recordId: string;
  recordTitle: string;
  createdAt: string;
  creator: SearchUser;
  matchedFields: Array<{ code: string; label: string }>;
  spaceId?: string;
  spaceName?: string;
};

export type SearchHitRecordComment = {
  appId: string;
  appName: string;
  recordId: string;
  recordTitle: string;
  commentId: string;
  createdAt: string;
  creator: SearchUser;
  spaceId?: string;
  spaceName?: string;
};

export type SearchHitSpace = {
  spaceId: string;
  spaceName: string;
  createdAt: string;
  creator: SearchUser;
};

export type SearchHitThread = {
  spaceId: string;
  spaceName: string;
  threadId: string;
  threadName: string;
  createdAt: string;
  creator: SearchUser;
};

export type SearchHitThreadComment = {
  commentId: string;
  replyId?: string;
  spaceId: string;
  spaceName: string;
  threadId: string;
  threadName: string;
  createdAt: string;
  creator: SearchUser;
};

export type SearchHitPeopleComment = {
  commentId: string;
  replyId?: string;
  owner: SearchUser;
  createdAt: string;
  creator: SearchUser;
};

export type SearchHitMessageComment = {
  commentId: string;
  recipient: SearchUser;
  createdAt: string;
  creator: SearchUser;
};

export type SearchHitAttachment = {
  attachedTo: SearchAttachmentTarget;
  fileKey: string;
  name: string;
  createdAt: string;
  creator: SearchUser;
};

export type SearchHit =
  | (SearchHitBase & { type: "RECORD"; record: SearchHitRecord })
  | (SearchHitBase & {
      type: "RECORD_COMMENT";
      recordComment: SearchHitRecordComment;
    })
  | (SearchHitBase & { type: "SPACE"; space: SearchHitSpace })
  | (SearchHitBase & { type: "THREAD"; thread: SearchHitThread })
  | (SearchHitBase & {
      type: "THREAD_COMMENT";
      threadComment: SearchHitThreadComment;
    })
  | (SearchHitBase & {
      type: "PEOPLE_COMMENT";
      peopleComment: SearchHitPeopleComment;
    })
  | (SearchHitBase & {
      type: "MESSAGE_COMMENT";
      messageComment: SearchHitMessageComment;
    })
  | (SearchHitBase & {
      type: "ATTACHMENT";
      attachment: SearchHitAttachment & { attachedTo: "RECORD" };
      record: SearchHitRecord;
    })
  | (SearchHitBase & {
      type: "ATTACHMENT";
      attachment: SearchHitAttachment & { attachedTo: "SPACE" };
      space: SearchHitSpace;
    })
  | (SearchHitBase & {
      type: "ATTACHMENT";
      attachment: SearchHitAttachment & { attachedTo: "THREAD" };
      thread: SearchHitThread;
    })
  | (SearchHitBase & {
      type: "ATTACHMENT";
      attachment: SearchHitAttachment & { attachedTo: "THREAD_COMMENT" };
      threadComment: SearchHitThreadComment;
    })
  | (SearchHitBase & {
      type: "ATTACHMENT";
      attachment: SearchHitAttachment & { attachedTo: "PEOPLE_COMMENT" };
      peopleComment: SearchHitPeopleComment;
    })
  | (SearchHitBase & {
      type: "ATTACHMENT";
      attachment: SearchHitAttachment & { attachedTo: "MESSAGE_COMMENT" };
      messageComment: SearchHitMessageComment;
    });

export type SearchResponse = {
  hits: SearchHit[];
  nextPageToken: string | null;
};
