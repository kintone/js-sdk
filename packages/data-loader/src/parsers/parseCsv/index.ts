import csvParse from "csv-parse/lib/sync";
import { PRIMARY_MARK } from "../../printers/printAsCsv/constants";
import { hasSubtable } from "../../printers/printAsCsv/hasSubtable";
import { extractSubtableFieldsValue } from "./extractSubtableFieldsValue";
import { isImportSupportedFieldType } from "./isImportSupportedFieldType";
import { formatToKintoneRecords } from "./formatToKintoneRecords";
import { convertToKintoneRecordFormatValue } from "./convertToKintoneRecordFormatValue";
import {
  CsvRows,
  FieldProperties,
  FieldsJson,
  ParsedRecord,
} from "../../types";

export const parseCsv = (csv: string, fieldsJson: FieldsJson) => {
  const rows: CsvRows = csvParse(csv, {
    columns: true,
    skip_empty_lines: true,
  });
  return convertToKintoneRecords({
    rows,
    fieldProperties: fieldsJson.properties,
  });
};

const buildSubtableRecord = ({
  primaryRow,
  fieldProperties,
  subtableFieldsValue,
}: {
  primaryRow: Record<string, string>;
  fieldProperties: FieldProperties;
  subtableFieldsValue: Record<string, any>;
}) => {
  return {
    ...subtableFieldsValue,
    ...Object.entries(primaryRow)
      .filter(([fieldCode]) =>
        isImportSupportedFieldType(fieldProperties[fieldCode]?.type)
      )
      .reduce((ret, [fieldCode, fieldValue]) => {
        return {
          ...ret,
          [fieldCode]: {
            value: convertToKintoneRecordFormatValue({
              fieldType: fieldProperties[fieldCode].type,
              value: fieldValue,
            }),
          },
        };
      }, {} as ParsedRecord),
  };
};

const convertToKintoneRecords = ({
  rows,
  fieldProperties,
}: {
  rows: CsvRows;
  fieldProperties: FieldProperties;
}) => {
  if (!hasSubtable(fieldProperties)) {
    return formatToKintoneRecords({
      rows,
      fieldProperties,
    });
  }

  let temp: Array<Record<string, string>> = [];
  const lastIndex = rows.length - 1;

  return rows.reduce<ParsedRecord[]>((kintoneFormatObjects, row, index) => {
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
    const subtableFieldsValue = extractSubtableFieldsValue({
      rows: temp,
      fieldProperties,
    });

    const subtableRecord = buildSubtableRecord({
      primaryRow,
      fieldProperties,
      subtableFieldsValue,
    });

    temp = [row];

    return kintoneFormatObjects.concat([subtableRecord]);
  }, []);
};
