import csvParse from "csv-parse/lib/sync";
import { PRIMARY_MARK } from "../../printers/printAsCsv/constants";
import { hasSubtable } from "../../printers/printAsCsv/hasSubtable";
import { extractSubtableFieldsValue } from "./extractSubtableFieldsValue";
import { isImportSupportedFieldType } from "./isImportSupportedFieldType";
import { convertToRecordForImportList } from "./convertToRecordForImportList";
import { convertToKintoneRecordFormatValue } from "./convertToKintoneRecordFormatValue";
import { CsvRows, FieldProperties, FieldsJson } from "../../types/kintone";
import { RecordForImport } from "../../types/data-loader";

export const parseCsv = (
  csv: string,
  fieldsJson: FieldsJson
): RecordForImport[] => {
  const rows: CsvRows = csvParse(csv, {
    columns: true,
    skip_empty_lines: true,
  });
  return hasSubtable(fieldsJson.properties)
    ? convertToRecordsForImportFromSubtableRows({
        rows,
        fieldProperties: fieldsJson.properties,
      })
    : convertToRecordForImportList({
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
  subtableFieldsValue: RecordForImport;
}): RecordForImport => {
  return {
    ...subtableFieldsValue,
    ...Object.entries(primaryRow)
      .filter(([fieldCode]) =>
        isImportSupportedFieldType(fieldProperties[fieldCode]?.type)
      )
      .reduce((recordForParameter, [fieldCode, fieldValue]) => {
        return {
          ...recordForParameter,
          [fieldCode]: convertToKintoneRecordFormatValue({
            fieldType: fieldProperties[fieldCode].type,
            value: fieldValue,
          }),
        };
      }, {}),
  };
};

const convertToRecordsForImportFromSubtableRows = ({
  rows,
  fieldProperties,
}: {
  rows: CsvRows;
  fieldProperties: FieldProperties;
}) => {
  let temp: Array<Record<string, string>> = [];
  const lastIndex = rows.length - 1;

  return rows.reduce<RecordForImport[]>((recordForImport, row, index) => {
    const isPrimaryRow = !!row[PRIMARY_MARK];
    const isLastRow = index === lastIndex;
    const isEmpty = temp.length === 0;

    if (isLastRow) {
      temp.push(row);
    } else if (isEmpty || !isPrimaryRow) {
      temp.push(row);
      return recordForImport;
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

    return recordForImport.concat([subtableRecord]);
  }, []);
};
