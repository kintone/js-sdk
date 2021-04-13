import { KintoneFormFieldProperty } from "@kintone/rest-api-client";
import { formatToRecordValue } from "./formatToRecordValue";
import { CsvRows, FieldsJson } from "../../types";

const extractSubTableFields = (rows: CsvRows) => {
  return [
    ...new Set(
      rows.reduce<string[]>((fields, row) => {
        return fields.concat(
          Object.keys(row).filter((fieldCode) => fieldCode.indexOf(".") !== -1)
        );
      }, [])
    ),
  ];
};

export const extractSubTableFieldsValue = ({
  rows,
  fieldsJson,
}: {
  rows: CsvRows;
  fieldsJson: FieldsJson;
}) => {
  const subTableFields = extractSubTableFields(rows);
  const parentFieldCodes = [
    ...new Set(
      subTableFields.map((subTableFieldCode) => subTableFieldCode.split(".")[0])
    ),
  ];

  return parentFieldCodes.reduce<Record<string, any>>(
    (subTableValue, parentFieldCode) => {
      const regex = new RegExp(`^${parentFieldCode}.`);
      const childFieldCodes = subTableFields
        .filter((fieldCode) => regex.test(fieldCode))
        .map((fieldCode) => fieldCode.split(".")[1]);

      const value = rows.map((record) => {
        return childFieldCodes.reduce<any>(
          (ret, childFieldCode) => {
            if (childFieldCode === "id") {
              return {
                ...ret,
                id: record[`${parentFieldCode}.${childFieldCode}`],
              };
            }

            const fieldType = (fieldsJson.properties[
              parentFieldCode
            ] as KintoneFormFieldProperty.Subtable<any>).fields[childFieldCode]
              .type;
            return {
              ...ret,
              value: {
                ...ret.value,
                [childFieldCode]: formatToRecordValue({
                  fieldType,
                  value: record[`${parentFieldCode}.${childFieldCode}`],
                }),
              },
            };
          },
          { id: "", value: {} }
        );
      });
      return {
        ...subTableValue,
        [parentFieldCode]: {
          value,
        },
      };
    },
    {}
  );
};
