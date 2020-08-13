import { Entity } from "../entity";

type FieldRightAccessibility = "READ" | "WRITE" | "NONE";

type FieldRightEntityForResponse = {
  accessibility: FieldRightAccessibility;
  entity:
    | Entity
    | {
        type: "FIELD_ENTITY";
        code: string;
      };
  includeSubs: boolean;
};

type FieldRightEntityForParameter = {
  accessibility: FieldRightAccessibility;
  entity:
    | Entity
    | {
        type: "FIELD_ENTITY";
        code: string;
      };
  includeSubs?: boolean;
};

export type FieldRightForResponse = {
  code: string;
  entities: FieldRightEntityForResponse[];
};

export type FieldRightForParameter = {
  code: string;
  entities: FieldRightEntityForParameter[];
};

export type AppRightEntityForResponse = {
  entity:
    | Entity
    | {
        type: "CREATOR";
        code: null;
      };
  includeSubs: boolean;
  appEditable: boolean;
  recordViewable: boolean;
  recordAddable: boolean;
  recordEditable: boolean;
  recordDeletable: boolean;
  recordImportable: boolean;
  recordExportable: boolean;
};

export type AppRightEntityForParameter = {
  entity:
    | Entity
    | {
        type: "CREATOR";
      };
  includeSubs?: boolean;
  appEditable?: boolean;
  recordViewable?: boolean;
  recordAddable?: boolean;
  recordEditable?: boolean;
  recordDeletable?: boolean;
  recordImportable?: boolean;
  recordExportable?: boolean;
};

type RecordRightEntityForResponse = {
  entity:
    | Entity
    | {
        type: "FIELD_ENTITY";
        code: string;
      };
  viewable: boolean;
  editable: boolean;
  deletable: boolean;
  includeSubs: boolean;
};

type RecordRightEntityForParameter = {
  entity:
    | Entity
    | {
        type: "FIELD_ENTITY";
        code: string;
      };
  viewable?: boolean;
  editable?: boolean;
  deletable?: boolean;
  includeSubs?: boolean;
};

export type RecordRightForResponse = {
  entities: RecordRightEntityForResponse[];
  filterCond: string;
};

export type RecordRightForParameter = {
  entities: RecordRightEntityForParameter[];
  filterCond?: string;
};

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
