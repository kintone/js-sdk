import { encloseInDoubleQuotes } from "../encloseInDoubleQuotes";

describe("encloseInDoubleQuotes", () => {
  it("should enclose in double quotes correctly", () => {
    expect(encloseInDoubleQuotes(`test`)).toBe(`"test"`);
  });
});
