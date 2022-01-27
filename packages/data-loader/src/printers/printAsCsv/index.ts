import { convertKintoneRecordsToCsv } from "./convertKintoneRecordsToCsv";
import { FieldsJson } from "../../types/kintone";
import { DataLoaderRecord } from "../../types/data-loader";

export const printAsCsv = (
  records: DataLoaderRecord[],
  fieldsJson: FieldsJson
) => {
  const csv = convertKintoneRecordsToCsv({
    records,
    fieldProperties: fieldsJson.properties,
  });
  console.log(csv);
};
