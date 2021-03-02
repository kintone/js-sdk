import csvParse from "csv-parse/lib/sync";
import { KintoneFormFieldProperty } from "@kintone/rest-api-client";

const LINE_BREAK = "\n";

export const parseCsv = (
  csv: string,
  fieldsJson: { properties: Record<string, KintoneFormFieldProperty.OneOf> }
) => {
  const records: Array<Record<string, string>> = csvParse(csv, {
    columns: true,
    skip_empty_lines: true,
  });
  return records.map((record) => {
    return Object.keys(record).reduce<
      Record<
        string,
        { type: string; value: string | string[] | { code: string } }
      >
    >((fields, fieldCode) => {
      const fieldType = fieldsJson.properties[fieldCode].type;
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
          fields[fieldCode] = {
            type: fieldType,
            value: record[fieldCode],
          };
          break;
        case "CREATOR":
        case "MODIFIER":
          fields[fieldCode] = {
            type: fieldType,
            value: {
              code: record[fieldCode],
            },
          };
          break;
        case "MULTI_SELECT":
        case "CHECK_BOX":
          fields[fieldCode] = {
            type: fieldType,
            value: record[fieldCode] ? record[fieldCode].split(LINE_BREAK) : [],
          };
          break;
      }
      return fields;
    }, {});
  });
};
