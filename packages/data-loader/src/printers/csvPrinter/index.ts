import {
  KintoneFormFieldProperty,
  KintoneRecordField,
} from "@kintone/rest-api-client";
import { convertKintoneRecordsToCsv } from "./convertKintoneRecordsToCsv";

export type KintoneRecord = { [fieldCode: string]: KintoneRecordField.OneOf };
export type FieldsJson = {
  properties: { [k: string]: KintoneFormFieldProperty.OneOf };
};

export const csvPrinter = ({
  records,
  fieldsJson,
  exportFields,
}: {
  records: KintoneRecord[];
  fieldsJson: FieldsJson;
  exportFields?: string;
}) => {
  const csv = convertKintoneRecordsToCsv({
    records: records.slice().reverse(),
    fieldsJson,
    exportFields,
  });
  console.log(csv);
};
