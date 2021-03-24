import {
  KintoneFormFieldProperty,
  KintoneRecordField,
} from "@kintone/rest-api-client";
import { convertKintoneRecordsToCsv } from "./convertKintoneRecordsToCsv";

export type KintoneRecord = { [fieldCode: string]: KintoneRecordField.OneOf };
export type FieldsJson = {
  properties: { [k: string]: KintoneFormFieldProperty.OneOf };
};

export const printAsCsv = (
  records: KintoneRecord[],
  fieldsJson: FieldsJson
) => {
  const csv = convertKintoneRecordsToCsv({
    records: records.slice().reverse(),
    fieldsJson,
  });
  console.log(csv);
};
