import { hasSubtable } from "../hasSubtable";
import { FieldsJson } from "../../../types";

const fieldsJson: FieldsJson = require("./fixtures/fields.json");
const subtableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");

describe("hasSubTable", () => {
  it("should be true when includes SUBTABLE in fields.json", () => {
    expect(hasSubtable(subtableFieldsJson)).toBe(true);
  });
  it("should be false when not includes SUBTABLE in fields.json", () => {
    expect(hasSubtable(fieldsJson)).toBe(false);
  });
});
