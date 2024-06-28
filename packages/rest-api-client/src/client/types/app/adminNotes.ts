import type { AppID, Revision } from "..";

export type AdminNotes = {
  content: string;
  includeInTemplateAndDuplicates: boolean;
};

export type AdminNoteForParameter = Partial<AdminNotes> & {
  app: AppID;
  revision?: Revision;
};
