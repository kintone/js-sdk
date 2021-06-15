import { PRIMARY_MARK } from "./constants";
import { hasSubtable } from "./hasSubtable";
import { FieldProperties } from "../../types";
import { KintoneFormFieldProperty } from "@kintone/rest-api-client";

const supportedFieldTypes = [
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
  "MULTI_SELECT",
  "CHECK_BOX",
  "FILE",
  "SUBTABLE",
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
  "MULTI_SELECT",
  "CHECK_BOX",
  "FILE",
];

export const buildHeaderFields = (fieldProperties: FieldProperties) => {
  const fields = Object.keys(fieldProperties)
    .filter((fieldCode) =>
      supportedFieldTypes.includes(fieldProperties[fieldCode].type)
    )
    .reduce((ret, fieldCode) => {
      const field = fieldProperties[fieldCode];
      if (field.type === "SUBTABLE") {
        const fieldCodesInSubtable = Object.keys(field.fields).filter(
          (fieldCodeInSubtable) =>
            supportedFieldTypesInSubtable.includes(
              field.fields[fieldCodeInSubtable].type
            )
        );
        return ret.concat(fieldCode, ...fieldCodesInSubtable);
      }
      return ret.concat(fieldCode);
    }, [] as string[]);

  return hasSubtable(fieldProperties) ? [PRIMARY_MARK].concat(fields) : fields;
};
