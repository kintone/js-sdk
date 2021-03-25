import { escapeDoubleQuotes } from "../escapeDoubleQuotes";

describe("escapeQuotation", () => {
  it("should escape quotation correctly", () => {
    expect(escapeDoubleQuotes(`"test"`)).toBe(`""test""`);
  });
});
