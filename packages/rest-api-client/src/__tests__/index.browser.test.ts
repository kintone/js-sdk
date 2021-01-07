import * as browser from "../index.browser";
import { KintoneAbortSearchError } from "../error/KintoneAbortSearchError";
import { KintoneAllRecordsError } from "../error/KintoneAllRecordsError";
import { KintoneRestAPIError } from "../error/KintoneRestAPIError";

describe("index.browser", () => {
  it("should export each error class properly", () => {
    expect(browser.KintoneAbortSearchError).not.toBeUndefined();
    expect(browser.KintoneAbortSearchError).toBe(KintoneAbortSearchError);
    expect(browser.KintoneAllRecordsError).not.toBeUndefined();
    expect(browser.KintoneAllRecordsError).toBe(KintoneAllRecordsError);
    expect(browser.KintoneRestAPIError).not.toBeUndefined();
    expect(browser.KintoneRestAPIError).toBe(KintoneRestAPIError);
  })
})