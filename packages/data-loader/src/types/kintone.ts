import {
  KintoneFormFieldProperty,
  KintoneRecordField,
} from "@kintone/rest-api-client";

export type CsvRows = CsvRow[];
export type CsvRow = Record<string, string>;
export type KintoneRecordForParameter = {
  [fieldCode: string]: {
    value: unknown;
  };
};

export type KintoneRecordForResponse = {
  [fieldCode: string]: KintoneRecordField.OneOf;
};
export type FieldProperties = Record<string, KintoneFormFieldProperty.OneOf>;
export type FieldsJson = {
  properties: FieldProperties;
};
