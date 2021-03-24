import { FieldsJson } from "./index";

export const hasSubTable = (fieldsJson: FieldsJson) =>
  Object.keys(fieldsJson.properties).some(
    (fieldCode) => fieldsJson.properties[fieldCode].type === "SUBTABLE"
  );
