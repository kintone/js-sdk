import type { MockClient } from "../../http/MockClient";
import { buildMockClient } from "../../http/MockClient";
import { SearchClient } from "../SearchClient";
import { KintoneRequestConfigBuilder } from "../../KintoneRequestConfigBuilder";
import type { SearchRequest } from "../types";

describe("SearchClient", () => {
  let mockClient: MockClient;
  let searchClient: SearchClient;

  beforeEach(() => {
    const requestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl: "https://example.cybozu.com",
      auth: {
        type: "password",
        username: "hoge",
        password: "foo",
      },
    });
    mockClient = buildMockClient(requestConfigBuilder);
    searchClient = new SearchClient(mockClient);
  });

  describe("search with minimal params", () => {
    const params: SearchRequest = {
      query: [{ operator: "AND", keywords: ["売上"] }],
    };
    beforeEach(async () => {
      await searchClient.search(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/search.json");
    });
    it("should send a GET request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass params to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("search with nullable / empty array params", () => {
    const params: SearchRequest = {
      query: [{ operator: "AND", keywords: ["foo"] }],
      types: null,
      scopes: [],
      excludeScopes: null,
      creators: null,
      pageToken: null,
    };
    beforeEach(async () => {
      await searchClient.search(params);
    });
    it("should pass nullable params through to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/search.json");
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("search with full params", () => {
    const params: SearchRequest = {
      query: [
        { operator: "AND", keywords: ["売上", "月次"] },
        { operator: "NOT", keywords: ["経費"] },
      ],
      types: ["RECORD", "RECORD_COMMENT"],
      scopes: [
        { scope: "SPACE" },
        { scope: "APP", ids: [1, 2] },
        { scope: "PEOPLE", codes: ["tanaka"] },
      ],
      excludeScopes: [{ scope: "APP", ids: [99] }],
      createdAfter: "2025-03-01T12:34:56.789+09:00",
      createdBefore: "2026-04-30T23:59:59.999+09:00",
      creators: ["tanaka-taro"],
      sort: { by: "CREATED_AT", order: "DESC" },
      limit: 20,
      pageToken: "abc123",
    };
    beforeEach(async () => {
      await searchClient.search(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/search.json");
    });
    it("should send a GET request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass params to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});

describe("SearchClient with guestSpaceId", () => {
  it("should pass the path to the http client", async () => {
    const GUEST_SPACE_ID = 2;
    const params: SearchRequest = {
      query: [{ operator: "AND", keywords: ["foo"] }],
    };
    const requestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl: "https://example.cybozu.com",
      auth: { type: "session" },
    });
    const mockClient = buildMockClient(requestConfigBuilder);
    const searchClient = new SearchClient(mockClient, GUEST_SPACE_ID);
    await searchClient.search(params);
    expect(mockClient.getLogs()[0].path).toBe(
      `/k/guest/${GUEST_SPACE_ID}/v1/search.json`,
    );
  });
});
