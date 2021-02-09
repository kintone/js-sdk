import { Entity } from "../entity";

export type GeneralNotificationsForResponse = {
  entity: Record<"type" | "code", string>;
  includeSubs: boolean;
  recordAdded: boolean;
  recordEdited: boolean;
  commentAdded: boolean;
  statusChanged: boolean;
  fileImported: boolean;
};

export type PerRecordNotificationsForParameter = {
  filterCond: string;
  title?: string;
  targets: Array<{
    entity: Entity | { type: "FIELD_ENTITY"; code: string };
    includeSubs: boolean;
  }>;
};
