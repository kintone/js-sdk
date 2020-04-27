import { loadProfile } from "../";

describe("index", () => {
  describe("loadProfile", () => {
    it("should return a profile", () => {
      expect(loadProfile()).toEqual({
        username: "",
        password: "",
        baseUrl: "",
        apiToken: "",
        oAuthToken: "",
      });
    });
  });
});
