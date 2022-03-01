import { convertRecordsToCsv } from "./convertKintoneRecordsToCsv";
import { FieldsJson } from "../../types/kintone";
import { DataLoaderRecord } from "../../types/data-loader";

export const printAsCsv: (options: {
  records: DataLoaderRecord[];
  fieldsJson: FieldsJson;
  attachmentsDir?: string;
}) => void = (options) => {
  const { records, fieldsJson, attachmentsDir } = options;
  const csv = convertRecordsToCsv({
    records,
    fieldProperties: fieldsJson.properties,
    attachmentsDir,
  });
  console.log(csv);
};
