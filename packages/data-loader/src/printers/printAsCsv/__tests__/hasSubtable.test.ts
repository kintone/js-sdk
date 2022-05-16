import { hasSubtable } from "../hasSubtable";
import { FieldsJson } from "../../../types/kintone";

const fieldsJson: FieldsJson = require("./fixtures/fields.json");
const subtableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");

describe("hasSubTable", () => {
  it("should be true when includes SUBTABLE in fields.json", () => {
    expect(hasSubtable(subtableFieldsJson.properties)).toBe(true);
  });
  it("should be false when not includes SUBTABLE in fields.json", () => {
    expect(hasSubtable(fieldsJson.properties)).toBe(false);
  });
});
