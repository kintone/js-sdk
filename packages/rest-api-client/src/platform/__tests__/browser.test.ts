import { getRequestToken } from "../browser";

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
    global.kintone = {
      getRequestToken: () => "dummy request token from kintone",
    };
    const requestToken = await getRequestToken();
    expect(requestToken).toBe("dummy request token from kintone");
  });
  it("should get a request token in garoon", async () => {
    global.garoon = {
      connect: {
        kintone: {
          getRequestToken: async () => "dummy request token from garoon",
        },
      },
    };
    const requestToken = await getRequestToken();
    expect(requestToken).toBe("dummy request token from garoon");
  });
  it("should throw an error in other service", async () => {
    await expect(getRequestToken()).rejects.toThrow(
      "session authentication must specify a request token"
    );
  });
});
