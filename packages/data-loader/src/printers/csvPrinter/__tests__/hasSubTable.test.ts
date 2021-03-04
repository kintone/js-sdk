import { hasSubTable } from "../hasSubTable";
import { FieldsJson } from "../index";

const fieldsJson: FieldsJson = require("./fixtures/fields.json");
const subTableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");

describe("hasSubTable", () => {
  it("should be true when not includes SUBTABLE in fields.json", () => {
    expect(hasSubTable(fieldsJson)).toBe(false);
  });
  it("should be false when includes SUBTABLE in fields.json", () => {
    expect(hasSubTable(subTableFieldsJson)).toBe(true);
  });
});
