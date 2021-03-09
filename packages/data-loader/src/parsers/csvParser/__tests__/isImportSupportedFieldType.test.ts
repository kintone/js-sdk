import { isImportSupportedFieldType } from "../isImportSupportedFieldType";

describe("isImportSupportedFieldType", () => {
  it("should be true when type is supported", () => {
    expect(isImportSupportedFieldType("SINGLE_LINE_TEXT")).toBe(true);
  });
  it("should be false when type is not supported", () => {
    expect(isImportSupportedFieldType("RECORD_NUMBER")).toBe(false);
  });
});
