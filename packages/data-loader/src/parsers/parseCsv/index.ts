import csvParse from "csv-parse/lib/sync";
import { KintoneFormFieldProperty } from "@kintone/rest-api-client";
import { PRIMARY_MARK } from "../../printers/printAsCsv/constants";
import { hasSubTable } from "../../printers/printAsCsv/hasSubTable";
import { extractSubTableFieldsValue } from "./extractSubTableFieldsValue";
import { isImportSupportedFieldType } from "./isImportSupportedFieldType";
import { formatToKintoneRecords } from "./formatToKintoneRecords";
import { formatToRecordValue } from "./formatToRecordValue";
import { CsvRows, FieldsJson, ParsedRecord } from "../../types";

export const parseCsv = (
  csv: string,
  fieldsJson: { properties: Record<string, KintoneFormFieldProperty.OneOf> }
) => {
  const rows: CsvRows = csvParse(csv, {
    columns: true,
    skip_empty_lines: true,
  });
  return convertToKintoneRecords({
    rows,
    fieldsJson,
  });
};

const buildSubTableRecord = ({
  primaryRow,
  fieldsJson,
  subTableFieldsValue,
}: {
  primaryRow: Record<string, string>;
  fieldsJson: FieldsJson;
  subTableFieldsValue: Record<string, any>;
}) => {
  return {
    ...Object.keys(primaryRow!)
      .filter((fieldCode) =>
        isImportSupportedFieldType(fieldsJson.properties[fieldCode]?.type)
      )
      .reduce((obj, fieldCode) => {
        const fieldType = fieldsJson.properties[fieldCode].type;
        return {
          ...obj,
          [fieldCode]: formatToRecordValue({
            fieldType,
            value: primaryRow![fieldCode],
          }),
        };
      }, {} as ParsedRecord),
    ...subTableFieldsValue,
  };
};

const convertToKintoneRecords = ({
  rows,
  fieldsJson,
}: {
  rows: CsvRows;
  fieldsJson: FieldsJson;
}) => {
  if (!hasSubTable(fieldsJson)) {
    return formatToKintoneRecords({
      rows,
      fieldsJson,
    });
  }

  let temp: Array<Record<string, string>> = [];
  const lastIndex = rows.length - 1;

  return rows.reduce<Array<{ [k: string]: string }>>(
    (kintoneFormatObjects, row, index) => {
      const isPrimaryRow = !!row[PRIMARY_MARK];
      const isLastRow = index === lastIndex;
      const isEmpty = temp.length === 0;

      if (isLastRow) {
        temp.push(row);
      } else if (isEmpty || !isPrimaryRow) {
        temp.push(row);
        return kintoneFormatObjects;
      }

      const primaryRow = temp[0];
      const subTableFieldsValue = extractSubTableFieldsValue({
        records: temp,
        fieldsJson,
      });

      const subTableRecord = buildSubTableRecord({
        primaryRow,
        fieldsJson,
        subTableFieldsValue,
      });

      temp = [row];

      return kintoneFormatObjects.concat([subTableRecord]);
    },
    []
  );
};
