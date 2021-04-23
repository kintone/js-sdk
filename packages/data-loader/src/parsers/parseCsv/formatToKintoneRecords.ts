import { isImportSupportedFieldType } from "./isImportSupportedFieldType";
import { convertToKintoneRecordFormatValue } from "./convertToKintoneRecordFormatValue";
import { CsvRows, FieldsJson, ParsedRecord } from "../../types";

export const formatToKintoneRecords = ({
  rows,
  fieldsJson,
}: {
  rows: CsvRows;
  fieldsJson: FieldsJson;
}) => {
  return rows.map((row) => {
    return Object.keys(row)
      .filter((fieldCode) => {
        const field = fieldsJson.properties[fieldCode];
        return field ? isImportSupportedFieldType(field.type) : false;
      })
      .reduce(
        (recordObjects, fieldCode) => ({
          ...recordObjects,
          [fieldCode]: {
            value: convertToKintoneRecordFormatValue({
              value: row[fieldCode],
              fieldType: fieldsJson.properties[fieldCode].type,
            }),
          },
        }),
        {} as ParsedRecord
      );
  });
};
