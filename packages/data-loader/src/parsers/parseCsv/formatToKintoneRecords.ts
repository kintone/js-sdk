import { isImportSupportedFieldType } from "./isImportSupportedFieldType";
import { convertToKintoneRecordFormatValue } from "./convertToKintoneRecordFormatValue";
import {
  CsvRows,
  FieldProperties,
  FieldsJson,
  ParsedRecord,
} from "../../types";

export const formatToKintoneRecords = ({
  rows,
  fieldProperties,
}: {
  rows: CsvRows;
  fieldProperties: FieldProperties;
}) => {
  return rows.map((row) => {
    return Object.keys(row)
      .filter((fieldCode) => {
        const field = fieldProperties[fieldCode];
        return field ? isImportSupportedFieldType(field.type) : false;
      })
      .reduce(
        (recordObjects, fieldCode) => ({
          ...recordObjects,
          [fieldCode]: {
            value: convertToKintoneRecordFormatValue({
              value: row[fieldCode],
              fieldType: fieldProperties[fieldCode].type,
            }),
          },
        }),
        {} as ParsedRecord
      );
  });
};
