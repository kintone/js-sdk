import { buildRestAPIClient } from "../api";

import { KintoneRestAPIClient } from "@kintone/rest-api-client";

jest.mock("@kintone/rest-api-client");

describe("api", () => {
  const USERNAME = "username";
  const PASSWORD = "password";
  const BASE_URL = "https://localhost";

  it("should pass username and password to the apiClient correctly", () => {
    const apiClient = buildRestAPIClient({
      baseUrl: BASE_URL,
      username: USERNAME,
      password: PASSWORD,
    });
    expect(apiClient).toBeInstanceOf(KintoneRestAPIClient);
    expect(KintoneRestAPIClient).toHaveBeenCalledWith({
      baseUrl: BASE_URL,
      auth: {
        username: USERNAME,
        password: PASSWORD,
      },
    });
  });

  it("should pass guestSpaceId to the apiClient correctly", () => {
    const GUEST_SPACE_ID = 1;

    const apiClient = buildRestAPIClient({
      baseUrl: BASE_URL,
      username: USERNAME,
      password: PASSWORD,
      guestSpaceId: GUEST_SPACE_ID,
    });
    expect(apiClient).toBeInstanceOf(KintoneRestAPIClient);
    expect(KintoneRestAPIClient).toHaveBeenCalledWith({
      baseUrl: BASE_URL,
      auth: {
        username: USERNAME,
        password: PASSWORD,
      },
      guestSpaceId: GUEST_SPACE_ID,
    });
  });
});
