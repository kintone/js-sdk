import { convertToKintoneRecordFormatValue } from "./convertToKintoneRecordFormatValue";
import { CsvRows, FieldProperties, FieldsJson } from "../../types/kintone";
import { KintoneFormFieldProperty } from "@kintone/rest-api-client";
import { isImportSupportedFieldType } from "./isImportSupportedFieldType";

type InSubtableFieldProperty = Record<
  string,
  KintoneFormFieldProperty.InSubtable
>;

type InSubtableFieldValue = Record<
  string,
  { value: string | string[] | { code: string } }
>;

export const extractSubtableFieldsValue = ({
  rows,
  fieldProperties,
}: {
  rows: CsvRows;
  fieldProperties: FieldProperties;
}) => {
  return Object.values(fieldProperties).reduce<
    Record<
      string,
      { value: Array<{ id: string; value: InSubtableFieldValue }> }
    >
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
) => {
  return rows
    .filter((row) => {
      return row[subtableFieldProperty.code];
    })
    .map((row) => {
      return {
        id: row[subtableFieldProperty.code],
        value: Object.values(subtableFieldProperty.fields)
          .filter((inSubtableFieldProperty) =>
            isImportSupportedFieldType(inSubtableFieldProperty.type)
          )
          .reduce<InSubtableFieldValue>(
            (inSubtableFieldValue, inSubtableFieldProperty) => {
              return {
                ...inSubtableFieldValue,
                [inSubtableFieldProperty.code]: {
                  value: convertToKintoneRecordFormatValue({
                    fieldType: inSubtableFieldProperty.type,
                    value: row[inSubtableFieldProperty.code],
                  }),
                },
              };
            },
            {}
          ),
      };
    });
};
