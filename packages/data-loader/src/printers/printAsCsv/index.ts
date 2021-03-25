import { convertKintoneRecordsToCsv } from "./convertKintoneRecordsToCsv";
import { FieldsJson, KintoneRecord } from "../../types";

export const printAsCsv = ({
  records,
  fieldsJson,
  exportFields,
}: {
  records: KintoneRecord[];
  fieldsJson: FieldsJson;
  exportFields?: string;
}) => {
  const csv = convertKintoneRecordsToCsv({
    records,
    fieldsJson,
    exportFields,
  });
  console.log(csv);
};
