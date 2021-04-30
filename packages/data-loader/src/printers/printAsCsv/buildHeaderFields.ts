import { PRIMARY_MARK } from "./constants";
import { hasSubtable } from "./hasSubtable";
import { FieldProperties } from "../../types";

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
  "SUBTABLE",
];

export const buildHeaderFields = (fieldProperties: FieldProperties) => {
  const fields = Object.keys(fieldProperties)
    .filter((fieldCode) =>
      supportedFieldTypes.includes(fieldProperties[fieldCode].type)
    )
    .reduce((ret, fieldCode) => {
      const field = fieldProperties[fieldCode];
      const fieldCodesInSubtable =
        field.type === "SUBTABLE" ? Object.keys(field.fields) : [];
      return ret.concat(fieldCode, ...fieldCodesInSubtable);
    }, [] as string[]);

  return hasSubtable(fieldProperties) ? [PRIMARY_MARK].concat(fields) : fields;
};
