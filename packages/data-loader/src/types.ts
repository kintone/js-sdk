import {
  KintoneFormFieldProperty,
  KintoneRecordField,
} from "@kintone/rest-api-client";

export type CsvRecords = Array<Record<string, string>>;
export type ParsedRecord = Record<string, Record<"value", unknown>>;
export type KintoneRecord = { [fieldCode: string]: KintoneRecordField.OneOf };
export type FieldsJson = {
  properties: { [k: string]: KintoneFormFieldProperty.OneOf };
};
