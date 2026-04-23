import type { AppID, Revision } from "../index.js";

export type AdminNotes = {
  content: string;
  includeInTemplateAndDuplicates: boolean;
};

export type AdminNotesForParameter = Partial<AdminNotes> & {
  app: AppID;
  revision?: Revision;
};
