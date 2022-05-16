import { PRIMARY_MARK } from "./constants";
import { hasSubtable } from "./hasSubtable";
import { FieldProperties } from "../../types/kintone";
import { KintoneFormFieldProperty } from "@kintone/rest-api-client";

const supportedFieldTypes: Array<KintoneFormFieldProperty.OneOf["type"]> = [
  "RECORD_NUMBER",
  "SINGLE_LINE_TEXT",
  "RADIO_BUTTON",
  "MULTI_LINE_TEXT",
  "NUMBER",
  "RICH_TEXT",
  "LINK",
  "DROP_DOWN",
  "CALC",
  "CREATOR",
  "MODIFIER",
  "UPDATED_TIME",
  "CREATED_TIME",
  "DATETIME",
  "DATE",
  "TIME",
  "MULTI_SELECT",
  "CHECK_BOX",
  "FILE",
  "SUBTABLE",
  "USER_SELECT",
  "ORGANIZATION_SELECT",
  "GROUP_SELECT",
];

const supportedFieldTypesInSubtable: Array<
  KintoneFormFieldProperty.InSubtable["type"]
> = [
  "SINGLE_LINE_TEXT",
  "RADIO_BUTTON",
  "MULTI_LINE_TEXT",
  "NUMBER",
  "RICH_TEXT",
  "LINK",
  "DROP_DOWN",
  "CALC",
  "DATETIME",
  "DATE",
  "TIME",
  "MULTI_SELECT",
  "CHECK_BOX",
  "FILE",
  "USER_SELECT",
  "ORGANIZATION_SELECT",
  "GROUP_SELECT",
];

export const buildHeaderFields = (fieldProperties: FieldProperties) => {
  const fields = Object.keys(fieldProperties)
    .filter((fieldCode) =>
      supportedFieldTypes.includes(fieldProperties[fieldCode].type)
    )
    .reduce((headerFields, fieldCode) => {
      const field = fieldProperties[fieldCode];
      if (field.type === "SUBTABLE") {
        const fieldCodesInSubtable = Object.keys(field.fields).filter(
          (fieldCodeInSubtable) =>
            supportedFieldTypesInSubtable.includes(
              field.fields[fieldCodeInSubtable].type
            )
        );
        return headerFields.concat(fieldCode, ...fieldCodesInSubtable);
      }
      return headerFields.concat(fieldCode);
    }, [] as string[]);

  return hasSubtable(fieldProperties) ? [PRIMARY_MARK].concat(fields) : fields;
};
