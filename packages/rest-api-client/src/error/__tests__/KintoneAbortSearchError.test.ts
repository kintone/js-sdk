import { KintoneAbortSearchError } from "../KintoneAbortSearchError";

describe("KintoneAbortSearchError", () => {
  describe("constructor", () => {
    it("should create an instance of KintoneAbortSearchError", () => {
      expect(new KintoneAbortSearchError("")).toBeInstanceOf(
        KintoneAbortSearchError,
      );
    });
  });
});
