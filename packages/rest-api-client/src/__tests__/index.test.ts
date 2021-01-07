import * as index from "../index";
import { KintoneAbortSearchError } from "../error/KintoneAbortSearchError";
import { KintoneAllRecordsError } from "../error/KintoneAllRecordsError";
import { KintoneRestAPIError } from "../error/KintoneRestAPIError";

describe("index", () => {
  it("should export each error class properly", () => {
    expect(index.KintoneAbortSearchError).not.toBeUndefined();
    expect(index.KintoneAbortSearchError).toBe(KintoneAbortSearchError);
    expect(index.KintoneAllRecordsError).not.toBeUndefined();
    expect(index.KintoneAllRecordsError).toBe(KintoneAllRecordsError);
    expect(index.KintoneRestAPIError).not.toBeUndefined();
    expect(index.KintoneRestAPIError).toBe(KintoneRestAPIError);
  })
})