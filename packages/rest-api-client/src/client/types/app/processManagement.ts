import { Appearance } from "./utilityType";
import { Entity } from "../entity";

type AssigneeEntity<T extends Appearance> = T extends "response"
  ? {
      entity:
        | Entity
        | {
            type: "FIELD_ENTITY" | "CUSTOM_FIELD";
            code: string;
          }
        | {
            type: "CREATOR";
            code: null;
          };
      includeSubs: boolean;
    }
  : {
      entity:
        | Entity
        | {
            type: "FIELD_ENTITY" | "CUSTOM_FIELD";
            code: string;
          }
        | {
            type: "CREATOR";
          };
      includeSubs?: boolean;
    };

type AssigneeType = "ONE" | "ALL" | "ANY";

export type State<T extends Appearance> = T extends "response"
  ? {
      index: string;
      name: string;
      assignee: {
        type: AssigneeType;
        entities: Array<AssigneeEntity<T>>;
      };
    }
  : {
      index: string | number;
      name?: string;
      assignee?: {
        type: AssigneeType;
        entities: Array<AssigneeEntity<T>>;
      };
    };

export type Action<T extends Appearance> = T extends "response"
  ? {
      name: string;
      from: string;
      to: string;
      filterCond: string;
    }
  : {
      name: string;
      from: string;
      to: string;
      filterCond?: string;
    };
