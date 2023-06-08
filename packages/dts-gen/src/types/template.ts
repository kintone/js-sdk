import type { FieldTypeGroups } from "../converters/fileldtype-converter";

export type RenderInput = {
  typeName: string;
  namespace: string;
  fieldTypeGroups: FieldTypeGroups;
};
