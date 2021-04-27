import { FieldsJson } from "../../types";

export const hasSubtable = (fieldsJson: FieldsJson) =>
  Object.keys(fieldsJson.properties).some(
    (fieldCode) => fieldsJson.properties[fieldCode].type === "SUBTABLE"
  );
