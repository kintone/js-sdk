import { KintoneAbortedSearchResultError } from "../KintoneAbortedSearchResultError";

describe("KintoneAbortedSearchResultError", () => {
  describe("constructor", () => {
    it("should create an instance of KintoneAbortedSearchResultError", () => {
      expect(new KintoneAbortedSearchResultError("")).toBeInstanceOf(
        KintoneAbortedSearchResultError
      );
    });
  });
});
