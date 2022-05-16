import { LINE_BREAK } from "../../printers/printAsCsv/constants";
import { FieldsForImport } from "../../types/data-loader";
import { FieldProperties } from "../../types/kintone";

export const convertFieldValue = ({
  type,
  value = "",
}: {
  type: FieldProperties[string]["type"];
  value: string;
}): FieldsForImport.OneOf => {
  switch (type) {
    case "SINGLE_LINE_TEXT":
    case "RADIO_BUTTON":
    case "MULTI_LINE_TEXT":
    case "NUMBER":
    case "RICH_TEXT":
    case "LINK":
    case "DROP_DOWN":
    case "DATE":
    case "DATETIME":
    case "TIME":
    case "UPDATED_TIME":
    case "CREATED_TIME":
      return { value };
    case "CREATOR":
    case "MODIFIER":
      return {
        value: {
          code: value,
        },
      };
    case "MULTI_SELECT":
    case "CHECK_BOX":
      return { value: value ? value.split(LINE_BREAK) : [] };
    case "USER_SELECT":
    case "ORGANIZATION_SELECT":
    case "GROUP_SELECT":
      return {
        value: value
          ? value.split(LINE_BREAK).map((code) => ({
              code,
            }))
          : [],
      };
    case "FILE":
      return {
        value: value
          ? value.split(LINE_BREAK).map((localFilePath) => ({
              localFilePath,
            }))
          : [],
      };
    default:
      return { value }; // TODO: Error handling
  }
};
