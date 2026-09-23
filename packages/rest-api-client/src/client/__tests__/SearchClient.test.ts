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
    it("should send a POST request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
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

  describe("search with Date input for createdAfter / createdBefore", () => {
    const after = new Date("2025-03-01T12:34:56.789Z");
    const before = new Date("2026-04-30T23:59:59.999Z");
    const params: SearchRequest = {
      query: [{ operator: "AND", keywords: ["foo"] }],
      createdAfter: after,
      createdBefore: before,
    };
    beforeEach(async () => {
      await searchClient.search(params);
    });
    it("should convert Date inputs to ISO strings", () => {
      expect(mockClient.getLogs()[0].params).toEqual({
        query: [{ operator: "AND", keywords: ["foo"] }],
        createdAfter: after.toISOString(),
        createdBefore: before.toISOString(),
      });
    });
  });

  describe("search with full params", () => {
    const params: SearchRequest = {
      query: [
        { operator: "AND", keywords: ["売上", "月次"] },
        { operator: "OR", keywords: ["速報", "サマリ"] },
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
    it("should send a POST request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass params to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("search with useSynonyms in a non-US region", () => {
    it('should pass useSynonyms: "true" through to the http client', async () => {
      const params: SearchRequest = {
        query: [{ operator: "AND", keywords: ["foo"] }],
        useSynonyms: "true",
      };
      await searchClient.search(params);
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });

    it('should pass useSynonyms: "false" through to the http client', async () => {
      const params: SearchRequest = {
        query: [{ operator: "AND", keywords: ["foo"] }],
        useSynonyms: "false",
      };
      await searchClient.search(params);
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });

    it("should not include useSynonyms in the posted params when it is omitted", async () => {
      const params: SearchRequest = {
        query: [{ operator: "AND", keywords: ["foo"] }],
      };
      await searchClient.search(params);
      expect(mockClient.getLogs()[0].params).not.toHaveProperty("useSynonyms");
    });
  });
});

describe("SearchClient in a US region", () => {
  let mockClient: MockClient;
  let searchClient: SearchClient;

  beforeEach(() => {
    const requestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl: "https://example.kintone.com",
      auth: { type: "apiToken", apiToken: "dummy" },
    });
    mockClient = buildMockClient(requestConfigBuilder);
    searchClient = new SearchClient(mockClient, undefined, true);
  });

  it('should throw an error when useSynonyms is "true"', () => {
    const params: SearchRequest = {
      query: [{ operator: "AND", keywords: ["foo"] }],
      useSynonyms: "true",
    };
    expect(() => searchClient.search(params)).toThrow(
      "Can't use useSynonyms parameter in US Region",
    );
    expect(mockClient.getLogs()).toHaveLength(0);
  });

  it('should throw an error when useSynonyms is "false" (specifying the parameter at all is rejected)', () => {
    const params: SearchRequest = {
      query: [{ operator: "AND", keywords: ["foo"] }],
      useSynonyms: "false",
    };
    expect(() => searchClient.search(params)).toThrow(
      "Can't use useSynonyms parameter in US Region",
    );
    expect(mockClient.getLogs()).toHaveLength(0);
  });

  it("should NOT throw an error when useSynonyms is omitted", async () => {
    const params: SearchRequest = {
      query: [{ operator: "AND", keywords: ["foo"] }],
    };
    await searchClient.search(params);
    expect(mockClient.getLogs()[0].params).not.toHaveProperty("useSynonyms");
  });
});

describe("SearchClient with guestSpaceId", () => {
  it("should pass the path to the http client", async () => {
    const GUEST_SPACE_ID = 2;
    const params: SearchRequest = {
      query: [{ operator: "AND", keywords: ["foo"] }],
    };
    // Use apiToken instead of session — session auth requires a browser-only
    // request token that is not available in Node.js tests.
    const requestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl: "https://example.cybozu.com",
      auth: { type: "apiToken", apiToken: "dummy" },
    });
    const mockClient = buildMockClient(requestConfigBuilder);
    const searchClient = new SearchClient(mockClient, GUEST_SPACE_ID);
    await searchClient.search(params);
    expect(mockClient.getLogs()[0].path).toBe(
      `/k/guest/${GUEST_SPACE_ID}/v1/search.json`,
    );
  });
});
