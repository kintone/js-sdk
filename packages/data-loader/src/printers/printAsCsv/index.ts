import { convertKintoneRecordsToCsv } from "./convertKintoneRecordsToCsv";
import { FieldsJson, KintoneRecord } from "../../types";

export const printAsCsv = (
  records: KintoneRecord[],
  fieldsJson: FieldsJson
) => {
  const csv = convertKintoneRecordsToCsv({
    records,
    fieldProperties: fieldsJson.properties,
  });
  console.log(csv);
};
