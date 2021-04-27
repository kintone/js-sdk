import { isSupportedFieldType } from "./isSupportedFieldType";
import { PRIMARY_MARK } from "./constants";
import { hasSubtable } from "./hasSubtable";
import { FieldsJson } from "../../types";

export const buildHeaderFields = (fieldsJson: FieldsJson) => {
  const fields = Object.keys(fieldsJson.properties)
    .filter((fieldCode) =>
      isSupportedFieldType(fieldsJson.properties[fieldCode])
    )
    .reduce((ret, fieldCode) => {
      const field = fieldsJson.properties[fieldCode];
      const fieldCodesInSubtable =
        field.type === "SUBTABLE" ? Object.keys(field.fields) : [];
      return ret.concat(fieldCode, ...fieldCodesInSubtable);
    }, [] as string[]);

  return hasSubtable(fieldsJson) ? [PRIMARY_MARK].concat(fields) : fields;
};
