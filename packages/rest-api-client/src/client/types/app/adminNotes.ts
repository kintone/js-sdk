import type { AppID, Revision } from "..";

export type AdminNotes = {
  content: string;
  includeInTemplateAndDuplicates: boolean;
};

export type AdminNotesForParameter = Partial<AdminNotes> & {
  app: AppID;
  revision?: Revision;
};
