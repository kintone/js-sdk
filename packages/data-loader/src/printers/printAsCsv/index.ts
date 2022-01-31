import { convertRecordsToCsv } from "./convertKintoneRecordsToCsv";
import { FieldsJson } from "../../types/kintone";
import { DataLoaderRecord } from "../../types/data-loader";

export const printAsCsv = (
  records: DataLoaderRecord[],
  fieldsJson: FieldsJson
) => {
  const csv = convertRecordsToCsv({
    records,
    fieldProperties: fieldsJson.properties,
  });
  console.log(csv);
};
