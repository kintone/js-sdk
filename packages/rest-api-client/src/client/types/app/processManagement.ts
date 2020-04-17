import { Appearance, ConditionalStrict, ConditionalExist } from "./utilityType";

type AssigneeEntity<T extends Appearance> = {
  entity:
    | {
        type:
          | "USER"
          | "GROUP"
          | "ORGANIZATION"
          | "FIELD_ENTITY"
          | "CUSTOM_FIELD";
        code: string;
      }
    | ({
        type: "CREATOR";
      } & ConditionalExist<T, "response", { code: null }>);
} & ConditionalStrict<T, "response", { includeSubs: boolean }>;

export type State<T extends Appearance> = {
  index: T extends "response"
    ? string
    : T extends "parameter"
    ? string | number
    : never;
} & ConditionalStrict<
  T,
  "response",
  {
    name: string;
    assignee: {
      type: "ONE" | "ALL" | "ANY";
      entities: Array<AssigneeEntity<T>>;
    };
  }
>;

export type Action<T extends Appearance> = {
  name: string;
  from: string;
  to: string;
} & ConditionalStrict<T, "response", { filterCond: string }>;
