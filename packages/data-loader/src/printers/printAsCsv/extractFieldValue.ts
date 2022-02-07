import { KintoneRecordField } from "@kintone/rest-api-client";
import { encloseInDoubleQuotes } from "./encloseInDoubleQuotes";
import { escapeDoubleQuotes } from "./escapeDoubleQuotes";
import { LINE_BREAK } from "./constants";
import { DataLoaderFields } from "../../types/data-loader";

export const extractFieldValue = (
  field: DataLoaderFields.OneOf,
  attachmentsDir?: string
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
    case "FILE":
      return encloseInDoubleQuotes(
        escapeDoubleQuotes(
          field.value
            .map((value) => (attachmentsDir ? value.localFilePath : value.name))
            .join(LINE_BREAK)
        )
      );
    case "SUBTABLE":
      return field.value.map((subtableRow) => ({
        id: encloseInDoubleQuotes(subtableRow.id),
        ...Object.keys(subtableRow.value).reduce<Record<string, string>>(
          (newSubtableRow, fieldCode) => {
            return {
              ...newSubtableRow,
              [fieldCode]: extractFieldValue(
                subtableRow.value[fieldCode],
                attachmentsDir
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
