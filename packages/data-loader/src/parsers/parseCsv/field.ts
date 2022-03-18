import { CsvRow, FieldProperties, FieldsJson } from "../../types/kintone";
import { FieldsForImport } from "../../types/data-loader";
import { importSupportedFieldTypes } from "./constants";
import { convertFieldValue } from "./fieldValue";

type Field = {
  code: string;
  value: string;
  type: FieldProperties[string]["type"];
};

export const convertField = (field: Field): FieldsForImport.OneOf => {
  return convertFieldValue(field);
};

// eslint-disable-next-line func-style
export function* fieldReader(
  row: CsvRow,
  fieldsJson: FieldsJson
): Generator<Field, void, undefined> {
  for (const [code, property] of Object.entries(fieldsJson.properties)) {
    if (!importSupportedFieldTypes.includes(property.type)) {
      continue;
    }
    if (property.type === "SUBTABLE") {
      continue;
    }
    if (!row[code]) {
      continue;
    }
    yield { code, value: row[code], type: property.type };
  }
}
