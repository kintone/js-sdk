import { encloseInDoubleQuotes } from "../encloseInDoubleQuotes";

describe("encloseInQuotation", () => {
  it("should enclose in quotation correctly", () => {
    expect(encloseInDoubleQuotes(`test`)).toBe(`"test"`);
  });
});
