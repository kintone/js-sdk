import { Appearance, ConditionalStrict, ConditionalExist } from "./utilityType";

type FieldRightEntity<T extends Appearance> = {
  accessibility: "READ" | "WRITE" | "NONE";
  entity: {
    code: string;
    type: "USER" | "GROUP" | "ORGANIZATION" | "FIELD_ENTITY";
  };
} & ConditionalStrict<T, "response", { includeSubs: boolean }>;

export type FieldRight<T extends Appearance> = {
  code: string;
  entities: Array<FieldRightEntity<T>>;
};

export type AppRightEntity<T extends Appearance> = {
  entity:
    | {
        code: string;
        type: "USER" | "GROUP" | "ORGANIZATION";
      }
    | ({
        type: "CREATOR";
      } & ConditionalExist<T, "response", { code: null }>);
} & ConditionalStrict<
  T,
  "response",
  {
    includeSubs: boolean;
    appEditable: boolean;
    recordViewable: boolean;
    recordAddable: boolean;
    recordEditable: boolean;
    recordDeletable: boolean;
    recordImportable: boolean;
    recordExportable: boolean;
  }
>;

type RecordRightEntity<T extends Appearance> = {
  entity: {
    code: string;
    type: "USER" | "GROUP" | "ORGANIZATION" | "FIELD_ENTITY";
  };
} & ConditionalStrict<
  T,
  "response",
  {
    viewable: boolean;
    editable: boolean;
    deletable: boolean;
    includeSubs: boolean;
  }
>;

export type RecordRight<T extends Appearance> = {
  entities: Array<RecordRightEntity<T>>;
} & ConditionalStrict<T, "response", { filterCond: string }>;

export type EvaluatedRecordRight = {
  id: string;
  record: {
    viewable: boolean;
    editable: boolean;
    deletable: boolean;
  };
  fields: {
    [fieldCode: string]: {
      viewable: boolean;
      editable: boolean;
    };
  };
};
