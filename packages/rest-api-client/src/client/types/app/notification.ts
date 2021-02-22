import { Entity } from "../entity";

export type GeneralNotificationForResponse = {
  entity:
    | Entity
    | {
        type: "FIELD_ENTITY";
        code: string;
      };
  includeSubs: boolean;
  recordAdded: boolean;
  recordEdited: boolean;
  commentAdded: boolean;
  statusChanged: boolean;
  fileImported: boolean;
};

export type PerRecordNotificationForParameter = {
  filterCond: string;
  title?: string;
  targets: Array<{
    entity: Entity | { type: "FIELD_ENTITY"; code: string };
    includeSubs?: boolean;
  }>;
};

export type PerRecordNotificationForResponse = {
  filterCond: string;
  title: string;
  targets: Array<{
    entity: Entity | { type: "FIELD_ENTITY"; code: string };
    includeSubs: boolean;
  }>;
  revision: string;
};

export type ReminderNotificationForResponse = {
  timing: {
    code: string;
    daysLater: string;
    hoursLater?: string;
    time?: string;
  };
  filterCond: string;
  title: string;
  targets: [
    {
      entity: Entity | { type: "FIELD_ENTITY"; code: string };
      includeSubs: boolean;
    }
  ];
};
