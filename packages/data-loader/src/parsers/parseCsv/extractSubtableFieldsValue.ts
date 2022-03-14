import { convertToKintoneRecordFormatValue } from "./convertToKintoneRecordFormatValue";
import { CsvRows, FieldProperties } from "../../types/kintone";
import { KintoneFormFieldProperty } from "@kintone/rest-api-client";
import { isImportSupportedFieldTypeInSubtable } from "./isImportSupportedFieldType";
import { FieldsForImport } from "../../types/data-loader";

type InSubtableFieldProperty = Record<
  string,
  KintoneFormFieldProperty.InSubtable
>;

export const extractSubtableFieldsValue = ({
  rows,
  fieldProperties,
}: {
  rows: CsvRows;
  fieldProperties: FieldProperties;
}): Record<string, FieldsForImport.Subtable> => {
  return Object.values(fieldProperties).reduce<
    Record<string, FieldsForImport.Subtable>
  >((subtableFieldValue, fieldProperty) => {
    if (fieldProperty.type !== "SUBTABLE") {
      return subtableFieldValue;
    }
    return {
      ...subtableFieldValue,
      [fieldProperty.code]: {
        value: buildSubtableValue(rows, fieldProperty),
      },
    };
  }, {});
};

const buildSubtableValue = (
  rows: CsvRows,
  subtableFieldProperty: KintoneFormFieldProperty.Subtable<InSubtableFieldProperty>
): FieldsForImport.Subtable["value"] => {
  return rows
    .filter((row) => {
      return row[subtableFieldProperty.code];
    })
    .map((row) => {
      return {
        id: row[subtableFieldProperty.code],
        value: Object.values(subtableFieldProperty.fields)
          .filter((inSubtableFieldProperty) =>
            isImportSupportedFieldTypeInSubtable(inSubtableFieldProperty.type)
          )
          .reduce((inSubtableFieldValue, inSubtableFieldProperty) => {
            return {
              ...inSubtableFieldValue,
              [inSubtableFieldProperty.code]: convertToKintoneRecordFormatValue(
                {
                  fieldType: inSubtableFieldProperty.type,
                  value: row[inSubtableFieldProperty.code],
                }
              ),
            };
          }, {}),
      };
    });
};
