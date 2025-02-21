/**
 * @jest-environment jsdom
 */

import { buildFormDataValue, getRequestToken } from "../browser";

describe("getRequestToken()", () => {
  let originalKintone: any;
  let originalGaroon: any;
  beforeEach(() => {
    originalGaroon = global.garoon;
    originalKintone = global.kintone;
  });
  afterEach(() => {
    global.garoon = originalGaroon;
    global.kintone = originalKintone;
  });
  it("should get a request token in kintone", async () => {
    const TOKEN = "dummy request token from kintone";
    global.kintone = {
      getRequestToken: () => TOKEN,
    };
    const requestToken = await getRequestToken();
    expect(requestToken).toBe(TOKEN);
  });
  it("should get a request token in garoon", async () => {
    const TOKEN = "dummy request token from garoon";
    global.garoon = {
      connect: {
        kintone: {
          getRequestToken: async () => TOKEN,
        },
      },
    };
    const requestToken = await getRequestToken();
    expect(requestToken).toBe(TOKEN);
  });
  it("should throw an error in other service", async () => {
    await expect(getRequestToken()).rejects.toThrow(
      "session authentication must specify a request token",
    );
  });
});

describe("buildFormDataValue", () => {
  it("should detect MIME type correctly (PDF)", () => {
    const blob = buildFormDataValue("dummy data", "attachment/input.pdf");
    expect(blob.type).toBe("application/pdf");
  });
});
