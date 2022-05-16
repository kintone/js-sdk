import { FieldProperties } from "../../types/kintone";

export const hasSubtable: (fieldProperties: FieldProperties) => boolean = (
  fieldProperties
) =>
  Object.values(fieldProperties).some(
    (fieldProperty) => fieldProperty.type === "SUBTABLE"
  );
