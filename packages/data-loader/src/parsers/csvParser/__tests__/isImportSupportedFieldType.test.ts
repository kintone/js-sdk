import { isImportSupportedFieldType } from "../isImportSupportedFieldType";

describe("isImportSupportedFieldType", () => {
  it("isImportSupportedFieldType", () => {
    expect(isImportSupportedFieldType("SINGLE_LINE_TEXT")).toBe(true);
    expect(isImportSupportedFieldType("RECORD_NUMBER")).toBe(false);
  });
});
