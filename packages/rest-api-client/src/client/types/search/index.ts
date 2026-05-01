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

export type SearchQuery = {
  operator: "AND" | "NOT";
  keywords: string[];
};

export type SearchScope = {
  scope: SearchScopeType;
  ids?: Array<number | string> | null;
  codes?: string[] | null;
};

export type SearchSort = {
  by?: SearchSortBy;
  order?: SearchSortOrder;
};

export type SearchRequest = {
  query: SearchQuery[];
  types?: SearchHitType[] | null;
  scopes?: SearchScope[] | null;
  excludeScopes?: SearchScope[] | null;
  createdAfter?: string;
  createdBefore?: string;
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
  matchedFields: Array<{ code: string; name: string }>;
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
  threadId: string;
  threadName: string;
  spaceId: string;
  spaceName: string;
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
  nextPageToken?: string;
};
