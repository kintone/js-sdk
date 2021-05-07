import { escapeDoubleQuotes } from "../escapeDoubleQuotes";

describe("escapeDoubleQuotes", () => {
  it("should escape double quotes correctly", () => {
    expect(escapeDoubleQuotes(`"test"`)).toBe(`""test""`);
  });
});
