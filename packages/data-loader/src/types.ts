import {
  KintoneFormFieldProperty,
  KintoneRecordField,
} from "@kintone/rest-api-client";

export type CsvRows = Array<Record<string, string>>;
export type ParsedRecord = Record<string, Record<"value", unknown>>;
export type KintoneRecordForResponse = {
  [fieldCode: string]: KintoneRecordField.OneOf;
};
export type FieldProperties = Record<string, KintoneFormFieldProperty.OneOf>;
export type FieldsJson = {
  properties: FieldProperties;
};
