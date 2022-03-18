import csvParse from "csv-parse/lib/sync";
import { CsvRows, FieldsJson } from "../../types/kintone";
import { RecordForImport } from "../../types/data-loader";
import { convertRecord, recordReader } from "./record";

export const parseCsv: (
  csv: string,
  fieldsJson: FieldsJson
) => RecordForImport[] = (csv, fieldsJson) => {
  const rows: CsvRows = csvParse(csv, {
    columns: true,
    skip_empty_lines: true,
  });

  const records: RecordForImport[] = [];

  for (const recordRows of recordReader(rows)) {
    const record = convertRecord(recordRows, fieldsJson);
    records.push(record);
  }

  return records;
};
