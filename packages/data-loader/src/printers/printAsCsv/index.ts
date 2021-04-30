import { convertKintoneRecordsToCsv } from "./convertKintoneRecordsToCsv";
import { FieldsJson, KintoneRecordForResponse } from "../../types";

export const printAsCsv = ({
  records,
  fieldsJson,
  exportFields,
}: {
  records: KintoneRecordForResponse[];
  fieldsJson: FieldsJson;
  exportFields?: string;
}) => {
  const csv = convertKintoneRecordsToCsv({
    records,
    fieldProperties: fieldsJson.properties,
    exportFields,
  });
  console.log(csv);
};
