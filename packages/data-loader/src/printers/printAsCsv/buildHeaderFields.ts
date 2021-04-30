import { isSupportedFieldType } from "./isSupportedFieldType";
import { PRIMARY_MARK } from "./constants";
import { hasSubtable } from "./hasSubtable";
import { FieldProperties } from "../../types";

export const buildHeaderFields = (fieldProperties: FieldProperties) => {
  const fields = Object.keys(fieldProperties)
    .filter((fieldCode) => isSupportedFieldType(fieldProperties[fieldCode]))
    .reduce((ret, fieldCode) => {
      const field = fieldProperties[fieldCode];
      const fieldCodesInSubtable =
        field.type === "SUBTABLE" ? Object.keys(field.fields) : [];
      return ret.concat(fieldCode, ...fieldCodesInSubtable);
    }, [] as string[]);

  return hasSubtable(fieldProperties) ? [PRIMARY_MARK].concat(fields) : fields;
};
