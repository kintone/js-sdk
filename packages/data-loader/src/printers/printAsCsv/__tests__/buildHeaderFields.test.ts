import { buildHeaderFields } from "../buildHeaderFields";
import { PRIMARY_MARK } from "../constants";
import { FieldsJson } from "../../../types/kintone";

const fieldsJson: FieldsJson = require("./fixtures/fields.json");
const subtableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");
const unsupportedFieldsJson: FieldsJson = require("./fixtures/unsupported_fields.json");

describe("buildHeaderFields", () => {
  it("should generate fieldCode array without subtable relation field correctly", () => {
    expect(buildHeaderFields(fieldsJson.properties)).toHaveLength(15);
    expect(
      buildHeaderFields(fieldsJson.properties).includes(PRIMARY_MARK)
    ).toBe(false);
  });
  it("should generate fieldCode array which contains relation to subtable field correctly", () => {
    expect(
      buildHeaderFields(subtableFieldsJson.properties).includes(PRIMARY_MARK)
    ).toBe(true);
    expect(buildHeaderFields(subtableFieldsJson.properties)).toHaveLength(18);
  });
  it("should generate fieldCode array which doesn't contain unsupported fields", () => {
    expect(
      buildHeaderFields(unsupportedFieldsJson.properties).includes(
        "subTableFile"
      )
    ).toBe(false);
    expect(buildHeaderFields(unsupportedFieldsJson.properties)).toHaveLength(5);
  });
});
