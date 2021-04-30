import { FieldProperties } from "../../types";

export const hasSubtable = (fieldProperties: FieldProperties) =>
  Object.keys(fieldProperties).some(
    (fieldCode) => fieldProperties[fieldCode].type === "SUBTABLE"
  );
