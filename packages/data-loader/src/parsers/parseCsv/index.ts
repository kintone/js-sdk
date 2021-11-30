import { parse } from "csv-parse/sync";
import { PRIMARY_MARK } from "../../printers/printAsCsv/constants";
import { hasSubtable } from "../../printers/printAsCsv/hasSubtable";
import { extractSubtableFieldsValue } from "./extractSubtableFieldsValue";
import { isImportSupportedFieldType } from "./isImportSupportedFieldType";
import { convertToKintoneRecordsForParameter } from "./convertToKintoneRecordsForParameter";
import { convertToKintoneRecordFormatValue } from "./convertToKintoneRecordFormatValue";
import {
  CsvRows,
  FieldProperties,
  FieldsJson,
  KintoneRecordForParameter,
} from "../../types";

export const parseCsv = (csv: string, fieldsJson: FieldsJson) => {
  const rows: CsvRows = parse(csv, {
    columns: true,
    skip_empty_lines: true,
  });
  return hasSubtable(fieldsJson.properties)
    ? convertToKintoneRecordsForParameterFromSubtableRows({
        rows,
        fieldProperties: fieldsJson.properties,
      })
    : convertToKintoneRecordsForParameter({
        rows,
        fieldProperties: fieldsJson.properties,
      });
};

const buildSubtableRecordForParameter = ({
  primaryRow,
  fieldProperties,
  subtableFieldsValue,
}: {
  primaryRow: Record<string, string>;
  fieldProperties: FieldProperties;
  subtableFieldsValue: KintoneRecordForParameter;
}): KintoneRecordForParameter => {
  return {
    ...subtableFieldsValue,
    ...Object.entries(primaryRow)
      .filter(([fieldCode]) =>
        isImportSupportedFieldType(fieldProperties[fieldCode]?.type)
      )
      .reduce<KintoneRecordForParameter>(
        (recordForParameter, [fieldCode, fieldValue]) => {
          return {
            ...recordForParameter,
            [fieldCode]: {
              value: convertToKintoneRecordFormatValue({
                fieldType: fieldProperties[fieldCode].type,
                value: fieldValue,
              }),
            },
          };
        },
        {}
      ),
  };
};

const convertToKintoneRecordsForParameterFromSubtableRows = ({
  rows,
  fieldProperties,
}: {
  rows: CsvRows;
  fieldProperties: FieldProperties;
}) => {
  let temp: Array<Record<string, string>> = [];
  const lastIndex = rows.length - 1;

  return rows.reduce<KintoneRecordForParameter[]>(
    (kintoneRecordsForParameter, row, index) => {
      const isPrimaryRow = !!row[PRIMARY_MARK];
      const isLastRow = index === lastIndex;
      const isEmpty = temp.length === 0;

      if (isLastRow) {
        temp.push(row);
      } else if (isEmpty || !isPrimaryRow) {
        temp.push(row);
        return kintoneRecordsForParameter;
      }

      const primaryRow = temp[0];
      const subtableFieldsValue = extractSubtableFieldsValue({
        rows: temp,
        fieldProperties,
      });

      const subtableRecord = buildSubtableRecordForParameter({
        primaryRow,
        fieldProperties,
        subtableFieldsValue,
      });

      temp = [row];

      return kintoneRecordsForParameter.concat([subtableRecord]);
    },
    []
  );
};
