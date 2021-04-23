import { LINE_BREAK } from "../../printers/printAsCsv/constants";

export const convertToKintoneRecordFormatValue = ({
  fieldType,
  value = "",
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
    default:
      return value;
  }
};
