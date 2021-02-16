import parseCsv from "csv-parse/lib/sync";
import { KintoneFormFieldProperty } from "@kintone/rest-api-client";

export const convertCsvToJson = (
  csv: string,
  fieldsJson: { properties: Record<string, KintoneFormFieldProperty.OneOf> }
) => {
  const records: Array<Record<string, string>> = parseCsv(csv, {
    columns: true,
    skip_empty_lines: true,
  });
  return records.map((record) => {
    return Object.keys(record).reduce<
      Record<string, { type: string; value: string | { code: string } }>
    >((fields, fieldCode) => {
      const fieldType = fieldsJson.properties[fieldCode].type;
      switch (fieldType) {
        case "RECORD_NUMBER":
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
      }
      return fields;
    }, {});
  });
};
