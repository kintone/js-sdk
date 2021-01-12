type Entity = {
  type: string;
  code: string;
};

export type GeneralNotificationsForResponse = {
  entity: Entity;
  includeSubs: boolean;
  recordAdded: boolean;
  recordEdited: boolean;
  commentAdded: boolean;
  statusChanged: boolean;
  fileImported: boolean;
};
