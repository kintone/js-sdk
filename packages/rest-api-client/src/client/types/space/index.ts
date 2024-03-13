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

export type SpaceMemberForResponse = {
  entity: Entity;
  isAdmin: boolean;
  isImplicit: boolean;
  includeSubs: boolean;
};

export type SpaceMemberForRequest = {
  entity: Entity;
  isAdmin?: boolean;
  includeSubs?: boolean;
};

export type Guest = {
  name: string;
  code: string;
  password: string;
  timezone: string;
  locale?: "auto" | "en" | "zh" | "ja";
  image?: string;
  surNameReading?: string;
  givenNameReading?: string;
  company?: string;
  division?: string;
  phone?: string;
  callto?: string;
};
