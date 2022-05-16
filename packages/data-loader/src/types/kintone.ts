import {
  KintoneFormFieldProperty,
  KintoneRecordField,
} from "@kintone/rest-api-client";
import { UpdateKey } from "@kintone/rest-api-client/src/client/types/record";
import { RecordID, Revision } from "@kintone/rest-api-client/src/client/types";

export type CsvRow = Record<string, string>;
export type KintoneRecordForParameter = {
  [fieldCode: string]: {
    value: unknown;
  };
};
export type KintoneRecordForUpdateParameter =
  | { id: RecordID; record?: KintoneRecordForParameter; revision?: Revision }
  | {
      updateKey: UpdateKey;
      record?: KintoneRecordForParameter;
      revision?: Revision;
    };

export type KintoneRecordForResponse = {
  [fieldCode: string]: KintoneRecordField.OneOf;
};
export type FieldProperties = Record<string, KintoneFormFieldProperty.OneOf>;
export type FieldsJson = {
  properties: FieldProperties;
};
