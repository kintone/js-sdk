import { KintoneRecordField } from "@kintone/rest-api-client";
import { encloseInQuotation } from "./encloseInQuotation";
import { escapeQuotation } from "./escapeQuotation";
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
      return encloseInQuotation(escapeQuotation(field.value));
    case "CREATOR":
    case "MODIFIER":
      return encloseInQuotation(escapeQuotation(field.value.code));
    case "MULTI_SELECT":
    case "CHECK_BOX":
      return encloseInQuotation(escapeQuotation(field.value.join(LINE_BREAK)));
    case "SUBTABLE":
      return field.value.map((subTableField) => ({
        id: subTableField.id,
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
