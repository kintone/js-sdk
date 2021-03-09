import { LINE_BREAK } from "../../printers/csvPrinter/constants";

export const formatToRecordValue = ({
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
        value,
      };
    case "CREATOR":
    case "MODIFIER":
      return {
        value: {
          code: value,
        },
      };
    case "MULTI_SELECT":
    case "CHECK_BOX":
      return {
        value: value ? value.split(LINE_BREAK) : [],
      };
    default:
      return {
        value,
      };
  }
};
