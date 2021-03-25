import { convertKintoneRecordsToCsv } from "./convertKintoneRecordsToCsv";
import { FieldsJson, KintoneRecord } from "../../types";

export const printAsCsv = (
  records: KintoneRecord[],
  fieldsJson: FieldsJson
) => {
  const csv = convertKintoneRecordsToCsv({
    records,
    fieldsJson,
  });
  console.log(csv);
};
