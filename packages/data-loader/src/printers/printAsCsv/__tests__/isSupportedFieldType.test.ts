import { isSupportedFieldType } from "../isSupportedFieldType";
import { FieldsJson } from "../index";

const subTableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");

describe("isSupportedFieldType", () => {
  it("should be true", () => {
    expect(isSupportedFieldType(subTableFieldsJson.properties.subTable)).toBe(
      true
    );
    expect(
      isSupportedFieldType(subTableFieldsJson.properties.multiSelect)
    ).toBe(true);
    expect(
      isSupportedFieldType(subTableFieldsJson.properties.multiLineText)
    ).toBe(true);
    expect(isSupportedFieldType(subTableFieldsJson.properties.calc)).toBe(true);
    expect(isSupportedFieldType(subTableFieldsJson.properties.checkBox)).toBe(
      true
    );
    expect(
      isSupportedFieldType(subTableFieldsJson.properties.createdTime)
    ).toBe(true);
    expect(isSupportedFieldType(subTableFieldsJson.properties.creator)).toBe(
      true
    );
    expect(isSupportedFieldType(subTableFieldsJson.properties.dropDown)).toBe(
      true
    );
    expect(isSupportedFieldType(subTableFieldsJson.properties.modifier)).toBe(
      true
    );
    expect(isSupportedFieldType(subTableFieldsJson.properties.number)).toBe(
      true
    );
    expect(
      isSupportedFieldType(subTableFieldsJson.properties.recordNumber)
    ).toBe(true);
    expect(
      isSupportedFieldType(subTableFieldsJson.properties.radioButton)
    ).toBe(true);
    expect(isSupportedFieldType(subTableFieldsJson.properties.richText)).toBe(
      true
    );
    expect(
      isSupportedFieldType(subTableFieldsJson.properties.singleLineText)
    ).toBe(true);
    expect(
      isSupportedFieldType(subTableFieldsJson.properties.updatedTime)
    ).toBe(true);
  });
  it("should be true", () => {
    expect(isSupportedFieldType(subTableFieldsJson.properties.Status)).toBe(
      false
    );
    expect(isSupportedFieldType(subTableFieldsJson.properties.Assignee)).toBe(
      false
    );
  });
});
