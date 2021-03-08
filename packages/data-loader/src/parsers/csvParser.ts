import csvParse from "csv-parse/lib/sync";
import { KintoneFormFieldProperty } from "@kintone/rest-api-client";
import { PRIMARY_MARK, RECORD_INDEX } from "../printers/csvPrinter/constants";
import { FieldsJson } from "../printers/csvPrinter";
import { hasSubTable } from "../printers/csvPrinter/hasSubTable";

const LINE_BREAK = "\n";

export const parseCsv = (
  csv: string,
  fieldsJson: { properties: Record<string, KintoneFormFieldProperty.OneOf> }
) => {
  const records: Array<Record<string, string>> = csvParse(csv, {
    columns: true,
    skip_empty_lines: true,
  });
  if (hasSubTable(fieldsJson)) {
    return mergeByIndex(records, fieldsJson);
  }
  return convertToKintoneRecords({
    records,
    fieldsJson,
  });
};

export type RecordObject = {
  [fieldCode: string]: { value: string | string[]; type: string };
};

const convertToKintoneRecords = ({
  records,
  fieldsJson,
}: {
  records: Array<Record<string, string>>;
  fieldsJson: FieldsJson;
}) => {
  return records.map((record) => {
    return Object.keys(record).reduce<RecordObject>(
      (ret, fieldCode) => ({
        ...ret,
        ...(isSupportedFieldType(fieldsJson.properties[fieldCode].type)
          ? {
              [fieldCode]: {
                type: fieldsJson.properties[fieldCode].type,
                value: formatToKintoneValue({
                  value: record[fieldCode],
                  fieldType: fieldsJson.properties[fieldCode].type,
                }),
              },
            }
          : {}),
      }),
      {}
    );
  });
};

const mergeByIndex = (
  records: Array<Record<string, string>>,
  fieldsJson: FieldsJson
) => {
  const byIndex = records.reduce<
    Record<string, Array<{ [k: string]: string }>>
  >((ret, record) => {
    if (ret[record[RECORD_INDEX]]) {
      ret[record[RECORD_INDEX]].push(record);
    } else {
      ret[record[RECORD_INDEX]] = [record];
    }
    return ret;
  }, {});
  return Object.keys(byIndex).reduce<Array<Record<string, string>>>(
    (ret, index) => {
      const primaryRow = byIndex[index].find((record) => record[PRIMARY_MARK]);
      const subTableFields = [
        ...new Set(
          byIndex[index].reduce<string[]>((fields, record) => {
            return fields.concat(
              Object.keys(record).filter(
                (fieldCode) => fieldCode.indexOf(".") !== -1
              )
            );
          }, [])
        ),
      ];
      const parentFieldCodes = [
        ...new Set(
          subTableFields.map(
            (subTableFieldCode) => subTableFieldCode.split(".")[0]
          )
        ),
      ];
      const subTableFieldValues = parentFieldCodes.reduce<Record<string, any>>(
        (subTableValue, parentFieldCode) => {
          const regex = new RegExp(`^${parentFieldCode}`);
          const childFieldCodes = subTableFields
            .filter((fieldCode) => regex.test(fieldCode))
            .map((fieldCode) => fieldCode.split(".")[1]);
          const value = byIndex[index].map((record) => {
            return childFieldCodes.reduce<any>(
              (v, childFieldCode) => {
                if (childFieldCode === "id") {
                  return {
                    ...v,
                    id: record[`${parentFieldCode}.${childFieldCode}`],
                  };
                }

                const fieldType = (fieldsJson.properties[
                  parentFieldCode
                ] as KintoneFormFieldProperty.Subtable<any>).fields[
                  childFieldCode
                ].type;
                const fieldValue = formatToKintoneValue({
                  fieldType,
                  value: record[`${parentFieldCode}.${childFieldCode}`],
                });
                return {
                  ...v,
                  value: {
                    ...v.value,
                    [childFieldCode]: {
                      type: fieldType,
                      value: fieldValue,
                    },
                  },
                };
              },
              { id: "", value: {} }
            );
          });
          return {
            ...subTableValue,
            [parentFieldCode]: {
              type: "SUBTABLE",
              value,
            },
          };
        },
        {}
      );

      const row = {
        ...Object.keys(primaryRow!)
          .filter(
            (fieldCode) =>
              fieldCode.indexOf(".") === -1 &&
              fieldCode !== PRIMARY_MARK &&
              fieldCode !== RECORD_INDEX &&
              fieldsJson.properties[fieldCode].type !== "RECORD_NUMBER"
          )
          .reduce<Record<string, string | any>>((obj, fieldCode) => {
            const fieldType = fieldsJson.properties[fieldCode].type;
            return {
              ...obj,
              [fieldCode]: {
                type: fieldType,
                value: formatToKintoneValue({
                  fieldType,
                  value: primaryRow![fieldCode],
                }),
              },
            };
          }, {}),
        ...subTableFieldValues,
      };
      ret.push(row);
      return ret;
    },
    []
  );
};

const formatToKintoneValue = ({
  fieldType,
  value,
}: {
  fieldType: string;
  value: any;
}) => {
  switch (fieldType) {
    case "SINGLE_LINE_TEXT":
    case "RADIO_BUTTON":
    case "MULTI_LINE_TEXT":
    case "NUMBER":
    case "RICH_TEXT":
    case "LINK":
    case "DROP_DOWN":
    case "CALC":
    case "UPDATED_TIME":
    case "CREATED_TIME":
      return value;
    case "CREATOR":
    case "MODIFIER":
      return {
        code: value,
      };
    case "MULTI_SELECT":
    case "CHECK_BOX":
      return value ? value.split(LINE_BREAK) : [];
  }
};

const isSupportedFieldType = (fieldType: string) => {
  return [
    "SINGLE_LINE_TEXT",
    "RADIO_BUTTON",
    "MULTI_LINE_TEXT",
    "NUMBER",
    "RICH_TEXT",
    "LINK",
    "DROP_DOWN",
    "CALC",
    "UPDATED_TIME",
    "CREATED_TIME",
    "CREATOR",
    "MODIFIER",
    "MULTI_SELECT",
    "CHECK_BOX",
  ].includes(fieldType);
};
