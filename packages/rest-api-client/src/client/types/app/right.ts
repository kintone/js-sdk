import { Appearance } from "./utilityType";

type EntityType = "USER" | "GROUP" | "ORGANIZATION";
type FieldRightAccessibility = "READ" | "WRITE" | "NONE";

type FieldRightEntity<T extends Appearance> = T extends "response"
  ? {
      accessibility: FieldRightAccessibility;
      entity: {
        code: string;
        type: EntityType | "FIELD_ENTITY";
      };
      includeSubs: boolean;
    }
  : {
      accessibility: FieldRightAccessibility;
      entity: {
        code: string;
        type: EntityType | "FIELD_ENTITY";
      };
      includeSubs?: boolean;
    };

export type FieldRight<T extends Appearance> = {
  code: string;
  entities: Array<FieldRightEntity<T>>;
};

export type AppRightEntity<T extends Appearance> = T extends "response"
  ? {
      entity:
        | {
            code: string;
            type: EntityType;
          }
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
    }
  : {
      entity:
        | {
            code: string;
            type: EntityType;
          }
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

type RecordRightEntity<T extends Appearance> = T extends "response"
  ? {
      entity: {
        code: string;
        type: EntityType | "FIELD_ENTITY";
      };
      viewable: boolean;
      editable: boolean;
      deletable: boolean;
      includeSubs: boolean;
    }
  : {
      entity: {
        code: string;
        type: EntityType | "FIELD_ENTITY";
      };
      viewable?: boolean;
      editable?: boolean;
      deletable?: boolean;
      includeSubs?: boolean;
    };

export type RecordRight<T extends Appearance> = T extends "response"
  ? {
      entities: Array<RecordRightEntity<T>>;
      filterCond: string;
    }
  : {
      entities: Array<RecordRightEntity<T>>;
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
