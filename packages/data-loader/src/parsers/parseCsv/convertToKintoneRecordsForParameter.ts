import { isImportSupportedFieldType } from "./isImportSupportedFieldType";
import { convertToKintoneRecordFormatValue } from "./convertToKintoneRecordFormatValue";
import {
  CsvRows,
  FieldProperties,
  KintoneRecordForParameter,
} from "../../types/kintone";

export const convertToKintoneRecordsForParameter = ({
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
      .reduce<KintoneRecordForParameter>(
        (kintoneRecordForParameter, [fieldCode, fieldValue]) => ({
          ...kintoneRecordForParameter,
          [fieldCode]: {
            value: convertToKintoneRecordFormatValue({
              value: fieldValue,
              fieldType: fieldProperties[fieldCode].type,
            }),
          },
        }),
        {}
      );
  });
};
