import { isSupportedFieldType } from "./isSupportedFieldType";
import { PRIMARY_MARK, RECORD_INDEX } from "./constants";
import { hasSubTable } from "./hasSubTable";
import { FieldsJson } from "../../types";

export const buildHeaderFields = (fieldsJson: FieldsJson) => {
  const fields = Object.keys(fieldsJson.properties)
    .filter((fieldCode) =>
      isSupportedFieldType(fieldsJson.properties[fieldCode])
    )
    .reduce((ret, fieldCode) => {
      const field = fieldsJson.properties[fieldCode];
      return ret.concat(
        field.type === "SUBTABLE"
          ? [
              `${fieldCode}.id`,
              ...Object.keys(field.fields).map(
                (subTableFieldCode) => `${fieldCode}.${subTableFieldCode}`
              ),
            ]
          : [fieldCode]
      );
    }, [] as string[]);

  return hasSubTable(fieldsJson)
    ? [PRIMARY_MARK, RECORD_INDEX].concat(fields)
    : fields;
};
