import { isImportSupportedFieldType } from "./isImportSupportedFieldType";
import { convertToKintoneRecordFormatValue } from "./convertToKintoneRecordFormatValue";
import {
  CsvRows,
  FieldProperties,
  KintoneRecordForParameter,
} from "../../types/kintone";
import { DataLoaderRecordForParameter } from "../../types/data-loader";

export const convertToDataLoaderRecordForParameterList = ({
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
      .reduce<DataLoaderRecordForParameter>(
        (dataLoaderRecordForParameter, [fieldCode, fieldValue]) => ({
          ...dataLoaderRecordForParameter,
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
