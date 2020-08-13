import { Entity } from "../entity";

type AssigneeEntityForResponse = {
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
};

type AssigneeEntityForParameter = {
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

export type StateForResponse = {
  index: string;
  name: string;
  assignee: {
    type: AssigneeType;
    entities: AssigneeEntityForResponse[];
  };
};

export type StateForParameter = {
  index: string | number;
  name?: string;
  assignee?: {
    type: AssigneeType;
    entities: AssigneeEntityForParameter[];
  };
};

export type ActionForResponse = {
  name: string;
  from: string;
  to: string;
  filterCond: string;
};

export type ActionForParameter = {
  name: string;
  from: string;
  to: string;
  filterCond?: string;
};
