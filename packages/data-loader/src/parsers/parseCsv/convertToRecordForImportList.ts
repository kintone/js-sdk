import { isImportSupportedFieldType } from "./isImportSupportedFieldType";
import { convertToKintoneRecordFormatValue } from "./convertToKintoneRecordFormatValue";
import { CsvRows, FieldProperties } from "../../types/kintone";
import { RecordForImport } from "../../types/data-loader";

export const convertToRecordForImportList = ({
  rows,
  fieldProperties,
}: {
  rows: CsvRows;
  fieldProperties: FieldProperties;
}) => {
  return rows.map((row) => {
    return Object.entries(row)
      .filter(([fieldCode]) => {
        const field = fieldProperties[fieldCode];
        return field ? isImportSupportedFieldType(field.type) : false;
      })
      .reduce<RecordForImport>(
        (recordForImport, [fieldCode, fieldValue]) => ({
          ...recordForImport,
          [fieldCode]: convertToKintoneRecordFormatValue({
            value: fieldValue,
            fieldType: fieldProperties[fieldCode].type,
          }),
        }),
        {}
      );
  });
};
