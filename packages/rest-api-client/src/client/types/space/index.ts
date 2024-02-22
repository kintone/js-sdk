import type { App } from "../app";

type AttachedApp = Omit<App, "spaceId">;

export type Space = {
  id: string;
  name: string;
  defaultThread: string;
  isPrivate: boolean;
  creator: { code: string; name: string };
  modifier: { code: string; name: string };
  memberCount: string;
  coverType: string;
  coverKey: string;
  coverUrl: string;
  body: string;
  useMultiThread: boolean;
  isGuest: boolean;
  attachedApps: AttachedApp[];
  fixedMember: boolean;
};
