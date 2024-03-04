import type { App } from "../app";

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

export type SpaceMembers = {
  members: SpaceMember[];
};

export type SpaceMember = {
  entity: {
    type: "USER" | "GROUP" | "ORGANIZATION";
    code: string;
  };
  isAdmin?: boolean;
  isImplicit?: boolean;
  includeSubs?: boolean;
};
