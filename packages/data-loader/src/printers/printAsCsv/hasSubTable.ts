import { FieldsJson } from "../../types";

export const hasSubTable = (fieldsJson: FieldsJson) =>
  Object.keys(fieldsJson.properties).some(
    (fieldCode) => fieldsJson.properties[fieldCode].type === "SUBTABLE"
  );
