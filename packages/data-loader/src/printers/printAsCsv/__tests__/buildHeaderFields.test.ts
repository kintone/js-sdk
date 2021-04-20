import { buildHeaderFields } from "../buildHeaderFields";
import { PRIMARY_MARK } from "../constants";
import { FieldsJson } from "../../../types";

const fieldsJson: FieldsJson = require("./fixtures/fields.json");
const subTableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");

describe("buildHeaderFields", () => {
  it("should generate fieldCode array without subtable relation field correctly", () => {
    expect(buildHeaderFields(fieldsJson)).toHaveLength(14);
    expect(buildHeaderFields(fieldsJson).includes(PRIMARY_MARK)).toBe(false);
  });
  it("should generate fieldCode array it contains relation to subtable field correctly", () => {
    expect(buildHeaderFields(subTableFieldsJson).includes(PRIMARY_MARK)).toBe(
      true
    );
    expect(buildHeaderFields(subTableFieldsJson)).toHaveLength(18);
  });
});
