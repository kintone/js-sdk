import { buildHeaderFields } from "../buildHeaderFields";
import { PRIMARY_MARK } from "../constants";
import { FieldsJson } from "../../../types/kintone";

const fieldsJson: FieldsJson = require("./fixtures/fields.json");
const fileFieldsJson: FieldsJson = require("./fixtures/file_fields.json");
const subtableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");

describe("buildHeaderFields", () => {
  it("should generate fieldCode array correctly (data without subtable)", () => {
    expect(
      buildHeaderFields(fieldsJson.properties).includes(PRIMARY_MARK)
    ).toBe(false);
    expect(buildHeaderFields(fieldsJson.properties)).toHaveLength(20);
    expect(buildHeaderFields(fileFieldsJson.properties)).toHaveLength(15);
  });
  it("should generate fieldCode array correctly (data with subtable)", () => {
    expect(
      buildHeaderFields(subtableFieldsJson.properties).includes(PRIMARY_MARK)
    ).toBe(true);
    expect(buildHeaderFields(subtableFieldsJson.properties)).toHaveLength(22);
  });
});
