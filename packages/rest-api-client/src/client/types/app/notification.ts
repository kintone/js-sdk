import { Entity } from "../entity";

export type PerRecordNotificationsForParameter = {
  filterCond: string;
  title?: string;
  targets: Array<{
    entity: Entity | { type: "FIELD_ENTITY"; code: string };
    includeSubs: boolean;
  }>;
};
