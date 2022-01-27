import { FieldProperties } from "../../types/kintone";

export const hasSubtable = (fieldProperties: FieldProperties) =>
  Object.keys(fieldProperties).some(
    (fieldCode) => fieldProperties[fieldCode].type === "SUBTABLE"
  );
