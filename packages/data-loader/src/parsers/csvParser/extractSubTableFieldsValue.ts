import { FieldsJson } from "../../printers/csvPrinter";
import { KintoneFormFieldProperty } from "@kintone/rest-api-client";
import { formatToRecordValue } from "./formatToRecordValue";
import { CsvRecords } from "./index";

const extractSubTableFields = (records: CsvRecords) => {
  return [
    ...new Set(
      records.reduce<string[]>((fields, record) => {
        return fields.concat(
          Object.keys(record).filter(
            (fieldCode) => fieldCode.indexOf(".") !== -1
          )
        );
      }, [])
    ),
  ];
};

export const extractSubTableFieldsValue = ({
  records,
  fieldsJson,
}: {
  records: CsvRecords;
  fieldsJson: FieldsJson;
}) => {
  const subTableFields = extractSubTableFields(records);
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

      const value = records.map((record) => {
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
