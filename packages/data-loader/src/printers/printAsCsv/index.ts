import { convertRecordsToCsv } from "./convertKintoneRecordsToCsv";
import { FieldsJson } from "../../types/kintone";
import { DataLoaderRecord } from "../../types/data-loader";

export const printAsCsv = (
  records: DataLoaderRecord[],
  fieldsJson: FieldsJson,
  attachmentsDir?: string
) => {
  const csv = convertRecordsToCsv({
    records,
    fieldProperties: fieldsJson.properties,
    attachmentsDir,
  });
  console.log(csv);
};
