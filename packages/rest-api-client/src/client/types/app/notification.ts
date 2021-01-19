export type GeneralNotificationsForResponse = {
  entity: Record<"type" | "code", string>;
  includeSubs: boolean;
  recordAdded: boolean;
  recordEdited: boolean;
  commentAdded: boolean;
  statusChanged: boolean;
  fileImported: boolean;
};
