import type { HttpTestServer } from "./fixtures/HttpTestServer";
import type { SearchClient } from "../SearchClient";
import type { SearchRequest } from "../types";
import {
  expectRequest,
  makeHttpClients,
} from "./fixtures/SearchClientHttpFixture";

describe("SearchClient (HTTP level)", () => {
  let httpServer: HttpTestServer;
  let searchClient: SearchClient;

  beforeEach(() => {
    const clients = makeHttpClients();
    searchClient = clients.searchClient;
    httpServer = clients.httpServer;
  });

  afterEach(() => {
    httpServer.close();
  });

  describe("search with minimal params", () => {
    const params: SearchRequest = {
      query: [{ operator: "AND", keywords: ["売上"] }],
    };
    beforeEach(async () => {
      await searchClient.search(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/search.json",
        body: params,
      });
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
    it("should send nullable params over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/search.json",
        body: params,
      });
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
    it("should send Date inputs as ISO strings over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/search.json",
        body: {
          query: [{ operator: "AND", keywords: ["foo"] }],
          createdAfter: after.toISOString(),
          createdBefore: before.toISOString(),
        },
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/search.json",
        body: params,
      });
    });
  });
});

describe("SearchClient with guestSpaceId (HTTP level)", () => {
  it("should send the guest space path over the wire", async () => {
    const GUEST_SPACE_ID = 2;
    const params: SearchRequest = {
      query: [{ operator: "AND", keywords: ["foo"] }],
    };
    const clients = makeHttpClients(GUEST_SPACE_ID);
    try {
      await clients.searchClient.search(params);
      expectRequest(clients.httpServer, 0, {
        method: "post",
        path: `/k/guest/${GUEST_SPACE_ID}/v1/search.json`,
        body: params,
      });
    } finally {
      clients.httpServer.close();
    }
  });
});
