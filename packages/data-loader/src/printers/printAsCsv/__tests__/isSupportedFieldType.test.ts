import { isSupportedFieldType } from "../isSupportedFieldType";
import { FieldsJson } from "../../../types";

const subtableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");

describe("isSupportedFieldType", () => {
  it("should be true", () => {
    expect(isSupportedFieldType(subtableFieldsJson.properties.subTable)).toBe(
      true
    );
    expect(
      isSupportedFieldType(subtableFieldsJson.properties.multiSelect)
    ).toBe(true);
    expect(
      isSupportedFieldType(subtableFieldsJson.properties.multiLineText)
    ).toBe(true);
    expect(isSupportedFieldType(subtableFieldsJson.properties.calc)).toBe(true);
    expect(isSupportedFieldType(subtableFieldsJson.properties.checkBox)).toBe(
      true
    );
    expect(
      isSupportedFieldType(subtableFieldsJson.properties.createdTime)
    ).toBe(true);
    expect(isSupportedFieldType(subtableFieldsJson.properties.creator)).toBe(
      true
    );
    expect(isSupportedFieldType(subtableFieldsJson.properties.dropDown)).toBe(
      true
    );
    expect(isSupportedFieldType(subtableFieldsJson.properties.modifier)).toBe(
      true
    );
    expect(isSupportedFieldType(subtableFieldsJson.properties.number)).toBe(
      true
    );
    expect(
      isSupportedFieldType(subtableFieldsJson.properties.recordNumber)
    ).toBe(true);
    expect(
      isSupportedFieldType(subtableFieldsJson.properties.radioButton)
    ).toBe(true);
    expect(isSupportedFieldType(subtableFieldsJson.properties.richText)).toBe(
      true
    );
    expect(
      isSupportedFieldType(subtableFieldsJson.properties.singleLineText)
    ).toBe(true);
    expect(
      isSupportedFieldType(subtableFieldsJson.properties.updatedTime)
    ).toBe(true);
  });
  it("should be true", () => {
    expect(isSupportedFieldType(subtableFieldsJson.properties.Status)).toBe(
      false
    );
    expect(isSupportedFieldType(subtableFieldsJson.properties.Assignee)).toBe(
      false
    );
  });
});
