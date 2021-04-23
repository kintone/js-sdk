import { convertToKintoneRecordFormatValue } from "./convertToKintoneRecordFormatValue";
import { CsvRows, FieldsJson } from "../../types";
import { KintoneFormFieldProperty } from "@kintone/rest-api-client";

type InSubtableFieldProperty = Record<
  string,
  KintoneFormFieldProperty.InSubtable
>;

type InSubtableFieldValue = Record<
  string,
  { value: string | string[] | { code: string } }
>;

export const extractSubTableFieldsValue = ({
  rows,
  fieldsJson,
}: {
  rows: CsvRows;
  fieldsJson: FieldsJson;
}) => {
  return Object.values(fieldsJson.properties).reduce<
    Record<
      string,
      { value: Array<{ id: string; value: InSubtableFieldValue }> }
    >
  >((subtableFieldValue, fieldProperty) => {
    if (fieldProperty.type !== "SUBTABLE") return subtableFieldValue;
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
        value: Object.values(
          subtableFieldProperty.fields
        ).reduce<InSubtableFieldValue>(
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
