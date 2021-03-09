import { FieldsJson } from "../../printers/csvPrinter";
import { ParsedRecord, CsvRecords } from "./index";
import { isImportSupportedFieldType } from "./isImportSupportedFieldType";
import { formatToRecordValue } from "./formatToRecordValue";

export const formatToKintoneRecords = ({
  records,
  fieldsJson,
}: {
  records: CsvRecords;
  fieldsJson: FieldsJson;
}) => {
  return records.map((record) => {
    return Object.keys(record)
      .filter((fieldCode) => {
        const field = fieldsJson.properties[fieldCode];
        return field ? isImportSupportedFieldType(field.type) : false;
      })
      .reduce(
        (recordObjects, fieldCode) => ({
          ...recordObjects,
          [fieldCode]: formatToRecordValue({
            value: record[fieldCode],
            fieldType: fieldsJson.properties[fieldCode].type,
          }),
        }),
        {} as ParsedRecord
      );
  });
};
