import csvParse from "csv-parse/lib/sync";
import { KintoneFormFieldProperty } from "@kintone/rest-api-client";
import { PRIMARY_MARK, RECORD_INDEX } from "../printers/csvPrinter/constants";
import { FieldsJson } from "../printers/csvPrinter";
import { hasSubTable } from "../printers/csvPrinter/hasSubTable";

export type RecordObject = {
  [fieldCode: string]: {
    value: string | string[] | { code: string };
    type: string;
  };
};

type Records = Array<Record<string, string>>;

const LINE_BREAK = "\n";

export const parseCsv = (
  csv: string,
  fieldsJson: { properties: Record<string, KintoneFormFieldProperty.OneOf> }
) => {
  const records: Records = csvParse(csv, {
    columns: true,
    skip_empty_lines: true,
  });
  return convertToKintoneRecords({
    records,
    fieldsJson,
  });
};

const formatToKintoneRecords = ({
  records,
  fieldsJson,
}: {
  records: Records;
  fieldsJson: FieldsJson;
}) => {
  return records.map((record) => {
    return Object.keys(record)
      .filter((fieldCode) => {
        const field = fieldsJson.properties[fieldCode];
        return field ? isSupportedFieldType(field.type) : false;
      })
      .reduce<RecordObject>(
        (recordObjects, fieldCode) => ({
          ...recordObjects,
          [fieldCode]: formatToRecordValue({
            value: record[fieldCode],
            fieldType: fieldsJson.properties[fieldCode].type,
          }),
        }),
        {}
      );
  });
};

const groupByIndex = (records: Records) => {
  return records.reduce<Record<string, Array<{ [k: string]: string }>>>(
    (ret, record) => {
      if (ret[record[RECORD_INDEX]]) {
        ret[record[RECORD_INDEX]].push(record);
      } else {
        ret[record[RECORD_INDEX]] = [record];
      }
      return ret;
    },
    {}
  );
};

const extractSubTableFields = (records: Records) => {
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

const extractSubTableFieldsValue = ({
  records,
  fieldsJson,
}: {
  records: Records;
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
      const regex = new RegExp(`^${parentFieldCode}`);
      const childFieldCodes = subTableFields
        .filter((fieldCode) => regex.test(fieldCode))
        .map((fieldCode) => fieldCode.split(".")[1]);

      const value = records.map((record) => {
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
            ] as KintoneFormFieldProperty.Subtable<any>).fields[childFieldCode]
              .type;
            return {
              ...v,
              value: {
                ...v.value,
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
          type: "SUBTABLE",
          value,
        },
      };
    },
    {}
  );
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
        isSupportedFieldType(fieldsJson.properties[fieldCode]?.type)
      )
      .reduce<Record<string, string | any>>((obj, fieldCode) => {
        const fieldType = fieldsJson.properties[fieldCode].type;
        return {
          ...obj,
          [fieldCode]: formatToRecordValue({
            fieldType,
            value: primaryRow![fieldCode],
          }),
        };
      }, {}),
    ...subTableFieldsValue,
  };
};

const convertToKintoneRecords = ({
  records,
  fieldsJson,
}: {
  records: Records;
  fieldsJson: FieldsJson;
}) => {
  if (!hasSubTable(fieldsJson)) {
    return formatToKintoneRecords({
      records,
      fieldsJson,
    });
  }

  const subTableRecordGroups = groupByIndex(records);

  return Object.keys(subTableRecordGroups).reduce<Records>(
    (subTableRecords, index) => {
      const primaryRow = subTableRecordGroups[index].find(
        (record) => record[PRIMARY_MARK]
      );
      if (!primaryRow) {
        return subTableRecords;
      }
      const subTableFieldsValue = extractSubTableFieldsValue({
        records: subTableRecordGroups[index],
        fieldsJson,
      });

      const subTableRecord = buildSubTableRecord({
        primaryRow,
        fieldsJson,
        subTableFieldsValue,
      });
      return subTableRecords.concat([subTableRecord]);
    },
    []
  );
};

const formatToRecordValue = ({
  fieldType,
  value,
}: {
  fieldType: string;
  value: string;
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
      return {
        type: fieldType,
        value,
      };
    case "CREATOR":
    case "MODIFIER":
      return {
        type: fieldType,
        value: {
          code: value,
        },
      };
    case "MULTI_SELECT":
    case "CHECK_BOX":
      return {
        type: fieldType,
        value: value ? value.split(LINE_BREAK) : [],
      };
    default:
      return {
        type: fieldType,
        value,
      };
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
