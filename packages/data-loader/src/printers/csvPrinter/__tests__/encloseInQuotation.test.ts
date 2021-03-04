import { encloseInQuotation } from "../encloseInQuotation";

describe("encloseInQuotation", () => {
  it("should enclose in quotation correctly", () => {
    expect(encloseInQuotation(`test`)).toBe(`"test"`);
  });
});
