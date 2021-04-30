import { isImportSupportedFieldType } from "./isImportSupportedFieldType";
import { convertToKintoneRecordFormatValue } from "./convertToKintoneRecordFormatValue";
import {
  CsvRows,
  FieldProperties,
  KintoneRecordForParameter,
} from "../../types";

export const convertToKintoneRecordsForParameter = ({
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
      .reduce<KintoneRecordForParameter>(
        (kintoneRecordForParameter, fieldCode) => ({
          ...kintoneRecordForParameter,
          [fieldCode]: {
            value: convertToKintoneRecordFormatValue({
              value: row[fieldCode],
              fieldType: fieldProperties[fieldCode].type,
            }),
          },
        }),
        {}
      );
  });
};
