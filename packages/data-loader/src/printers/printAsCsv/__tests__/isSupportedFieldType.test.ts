import { isSupportedFieldType } from "../isSupportedFieldType";
import { FieldsJson } from "../../../types";

const subtableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");

describe("isSupportedFieldType", () => {
  const SUPPORTED_FIELD_TYPES = [
    "recordNumber",
    "singleLineText",
    "multiLineText",
    "richText",
    "number",
    "checkBox",
    "dropDown",
    "radioButton",
    "multiSelect",
    "calc",
    "subTable",
    "creator",
    "createdTime",
    "modifier",
    "updatedTime",
  ];
  it.each(SUPPORTED_FIELD_TYPES)("should be true [%s]", (fieldType) => {
    expect(isSupportedFieldType(subtableFieldsJson.properties[fieldType])).toBe(
      true
    );
  });

  const UNSUPPORTED_FIELD_TYPES = ["Status", "Assignee"];
  it.each(UNSUPPORTED_FIELD_TYPES)("should be false [%s]", (fieldType) => {
    expect(isSupportedFieldType(subtableFieldsJson.properties[fieldType])).toBe(
      false
    );
  });
});
