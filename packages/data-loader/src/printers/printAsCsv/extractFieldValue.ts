import { KintoneRecordField } from "@kintone/rest-api-client";
import { encloseInDoubleQuotes } from "./encloseInDoubleQuotes";
import { escapeDoubleQuotes } from "./escapeDoubleQuotes";
import { LINE_BREAK } from "./constants";

export const extractFieldValue = (
  field: KintoneRecordField.OneOf
): string | Array<{ [fieldCode: string]: string }> => {
  switch (field.type) {
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
      return encloseInDoubleQuotes(escapeDoubleQuotes(field.value));
    case "CREATOR":
    case "MODIFIER":
      return encloseInDoubleQuotes(escapeDoubleQuotes(field.value.code));
    case "MULTI_SELECT":
    case "CHECK_BOX":
      return encloseInDoubleQuotes(
        escapeDoubleQuotes(field.value.join(LINE_BREAK))
      );
    case "SUBTABLE":
      return field.value.map((subTableField) => ({
        id: encloseInDoubleQuotes(subTableField.id),
        ...Object.keys(subTableField.value).reduce<Record<string, string>>(
          (ret, fieldCode) => {
            return {
              ...ret,
              [fieldCode]: extractFieldValue(
                subTableField.value[fieldCode]
              ) as string,
            };
          },
          {}
        ),
      }));
    default:
      return "";
  }
};
