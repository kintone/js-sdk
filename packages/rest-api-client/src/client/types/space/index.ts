import type { App } from "../app";
import type { Entity } from "../entity";

type AttachedApp = Pick<
  App,
  | "appId"
  | "code"
  | "name"
  | "description"
  | "threadId"
  | "createdAt"
  | "creator"
  | "modifiedAt"
  | "modifier"
>;

export type Space = {
  id: string;
  name: string;
  defaultThread: string;
  isPrivate: boolean;
  creator: { code: string; name: string };
  modifier: { code: string; name: string };
  memberCount: string;
  coverType: "BLOB" | "PRESET";
  coverKey: string;
  coverUrl: string;
  body: string;
  useMultiThread: boolean;
  isGuest: boolean;
  attachedApps: AttachedApp[];
  fixedMember: boolean;
};

export type CommentWithText = {
  text: string;
  files?: Array<{
    fileKey: string;
    width?: string | number;
  }>;
  mentions?: Entity[];
};

export type CommentWithFiles = {
  text?: string;
  files: Array<{
    fileKey: string;
    width?: string | number;
  }>;
  mentions?: Entity[];
};

export type ThreadComment = {
  space: string;
  thread: string;
  comment: CommentWithText | CommentWithFiles;
};
