import { escapeQuotation } from "../escapeQuotation";

describe("escapeQuotation", () => {
  it("should escape quotation correctly", () => {
    expect(escapeQuotation(`"test"`)).toBe(`""test""`);
  });
});
