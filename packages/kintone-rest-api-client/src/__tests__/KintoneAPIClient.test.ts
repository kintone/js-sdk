import { KintoneAPIClient } from "../KintoneAPIClient";

describe("KintoneAPIClient", () => {
  it("should be able to create an instance without any error", () => {
    expect(() => {
      new KintoneAPIClient({
        subdomain: "example",
        auth: { apiToken: "token" }
      });
    }).not.toThrow();
  });
});
