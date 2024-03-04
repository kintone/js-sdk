import type { MockClient } from "../../http/MockClient";
import { buildMockClient } from "../../http/MockClient";
import { SpaceClient } from "../SpaceClient";
import { KintoneRequestConfigBuilder } from "../../KintoneRequestConfigBuilder";
import type { SpaceMember } from "../types";

const SPACE_ID = 1;

describe("SpaceClient", () => {
  let mockClient: MockClient;
  let spaceClient: SpaceClient;

  beforeEach(() => {
    const requestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl: "https://example.cybozu.com",
      auth: { type: "apiToken", apiToken: "foo" },
    });
    mockClient = buildMockClient(requestConfigBuilder);
    spaceClient = new SpaceClient(mockClient);
  });

  describe("getSpace", () => {
    const params = {
      id: SPACE_ID,
    };
    beforeEach(async () => {
      await spaceClient.getSpace(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/space.json");
    });
    it("should send a get request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass id as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("deleteSpace", () => {
    const params = {
      id: SPACE_ID,
    };
    beforeEach(async () => {
      await spaceClient.deleteSpace(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/space.json");
    });
    it("should send a delete request", () => {
      expect(mockClient.getLogs()[0].method).toBe("delete");
    });
    it("should pass id as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("updateSpaceMembers", () => {
    const params: { id: number; members: SpaceMember[] } = {
      id: SPACE_ID,
      members: [
        {
          entity: {
            code: "user1",
            type: "USER",
          },
          isAdmin: true,
        },
        {
          entity: {
            code: "user2",
            type: "USER",
          },
          isAdmin: false,
        },
        {
          entity: {
            code: "group1",
            type: "GROUP",
          },
          isAdmin: false,
          includeSubs: true,
        },
      ],
    };

    beforeEach(async () => {
      await spaceClient.updateSpaceMembers(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/space/members.json");
    });
    it("should send a PUT request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass id, body to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});

describe("SpaceClient with guestSpaceId", () => {
  it("should pass the path to the http client", async () => {
    const GUEST_SPACE_ID = 2;
    const params = { id: GUEST_SPACE_ID };
    const requestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl: "https://example.cybozu.com",
      auth: { type: "session" },
    });
    const mockClient = buildMockClient(requestConfigBuilder);
    const appClient = new SpaceClient(mockClient, GUEST_SPACE_ID);
    await appClient.getSpace(params);
    expect(mockClient.getLogs()[0].path).toBe(
      `/k/guest/${GUEST_SPACE_ID}/v1/space.json`,
    );
  });
});
