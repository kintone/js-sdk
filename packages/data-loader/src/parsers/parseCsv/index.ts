import csvParse from "csv-parse/lib/sync";
import { PRIMARY_MARK } from "../../printers/printAsCsv/constants";
import { hasSubtable } from "../../printers/printAsCsv/hasSubtable";
import { extractSubtableFieldsValue } from "./extractSubtableFieldsValue";
import { isImportSupportedFieldType } from "./isImportSupportedFieldType";
import { formatToKintoneRecords } from "./formatToKintoneRecords";
import { convertToKintoneRecordFormatValue } from "./convertToKintoneRecordFormatValue";
import { CsvRows, FieldsJson, ParsedRecord } from "../../types";

export const parseCsv = (csv: string, fieldsJson: FieldsJson) => {
  const rows: CsvRows = csvParse(csv, {
    columns: true,
    skip_empty_lines: true,
  });
  return convertToKintoneRecords({
    rows,
    fieldsJson,
  });
};

const buildSubtableRecord = ({
  primaryRow,
  fieldsJson,
  subtableFieldsValue,
}: {
  primaryRow: Record<string, string>;
  fieldsJson: FieldsJson;
  subtableFieldsValue: Record<string, any>;
}) => {
  return {
    ...Object.keys(primaryRow)
      .filter((fieldCode) =>
        isImportSupportedFieldType(fieldsJson.properties[fieldCode]?.type)
      )
      .reduce((obj, fieldCode) => {
        const fieldType = fieldsJson.properties[fieldCode].type;
        return {
          ...obj,
          [fieldCode]: {
            value: convertToKintoneRecordFormatValue({
              fieldType,
              value: primaryRow[fieldCode],
            }),
          },
        };
      }, {} as ParsedRecord),
    ...subtableFieldsValue,
  };
};

const convertToKintoneRecords = ({
  rows,
  fieldsJson,
}: {
  rows: CsvRows;
  fieldsJson: FieldsJson;
}) => {
  if (!hasSubtable(fieldsJson)) {
    return formatToKintoneRecords({
      rows,
      fieldsJson,
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
      fieldsJson,
    });

    const subtableRecord = buildSubtableRecord({
      primaryRow,
      fieldsJson,
      subtableFieldsValue,
    });

    temp = [row];

    return kintoneFormatObjects.concat([subtableRecord]);
  }, []);
};
