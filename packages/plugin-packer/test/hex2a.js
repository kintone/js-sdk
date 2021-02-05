"use strict";

const { hex2a } = require("../dist/hex2a");

describe("hex2a", () => {
  it("empty string", () => {
    expect(hex2a("")).toBe("");
  });

  it("number", () => {
    expect(hex2a("0")).toBe("a");
    expect(hex2a("1")).toBe("b");
    expect(hex2a("9")).toBe("j");
  });

  it("alphabet", () => {
    expect(hex2a("a")).toBe("k");
    expect(hex2a("b")).toBe("l");
    expect(hex2a("f")).toBe("p");
  });

  it("string", () => {
    expect(hex2a("012abc")).toBe("abcklm");
  });

  it("throws for out of range", () => {
    expect(() => hex2a("/")).toThrow();
    expect(() => hex2a(":")).toThrow();
    expect(() => hex2a("`")).toThrow();
    expect(() => hex2a("g")).toThrow();
  });

  it("upper case is out of range", () => {
    expect(() => hex2a("A")).toThrow();
  });
});
