import { convertKintoneRecordsToCsv } from "./convertKintoneRecordsToCsv";
import { FieldsJson, KintoneRecordForResponse } from "../../types";

export const printAsCsv = (
  records: KintoneRecordForResponse[],
  fieldsJson: FieldsJson
) => {
  const csv = convertKintoneRecordsToCsv({
    records,
    fieldProperties: fieldsJson.properties,
  });
  console.log(csv);
};
