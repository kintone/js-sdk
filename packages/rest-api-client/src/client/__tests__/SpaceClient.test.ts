import type { MockClient } from "../../http/MockClient";
import { buildMockClient } from "../../http/MockClient";
import { SpaceClient } from "../SpaceClient";
import { KintoneRequestConfigBuilder } from "../../KintoneRequestConfigBuilder";
import type { ThreadComment, UpdateSpaceForRequest } from "../types";

const SPACE_ID = 1;
const SPACE_TEMPLATE_ID = 1;
const THREAD_ID = 1;

describe("SpaceClient", () => {
  let mockClient: MockClient;
  let spaceClient: SpaceClient;

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
    it("should send a GET request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass id as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("updateSpace", () => {
    const params = {
      id: SPACE_ID,
      name: "updated",
      isPrivate: false,
      useMultiThread: false,
      fixedMember: false,
      showAnnouncement: false,
      showThreadList: false,
      showAppList: false,
      showMemberList: false,
      showRelatedLinkList: false,
      permissions: {
        createApp: "EVERYONE",
      },
    } as UpdateSpaceForRequest;
    beforeEach(async () => {
      await spaceClient.updateSpace(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/space.json");
    });
    it("should send a PUT request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass params to the http client", () => {
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
    it("should send a DELETE request", () => {
      expect(mockClient.getLogs()[0].method).toBe("delete");
    });
    it("should pass id as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("updateSpaceBody", () => {
    const params = {
      id: SPACE_ID,
      body: "<b>This is a space body</b>",
    };
    beforeEach(async () => {
      await spaceClient.updateSpaceBody(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/space/body.json");
    });
    it("should send a PUT request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass id, body to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("getSpaceMembers", () => {
    const params = {
      id: SPACE_ID,
    };
    beforeEach(async () => {
      await spaceClient.getSpaceMembers(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/space/members.json");
    });
    it("should send a GET request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass id as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("updateSpaceMembers", () => {
    const params = {
      id: SPACE_ID,
      members: [
        {
          entity: {
            code: "user1",
            type: "USER" as const,
          },
          isAdmin: true,
        },
        {
          entity: {
            code: "user2",
            type: "USER" as const,
          },
          isAdmin: false,
        },
        {
          entity: {
            code: "group1",
            type: "GROUP" as const,
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
    it("should pass id, members parameters to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("addThread", () => {
    const params = {
      space: SPACE_ID,
      name: "Added Thread Name",
    };
    beforeEach(async () => {
      await spaceClient.addThread(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/space/thread.json");
    });
    it("should send a POST request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass space, name to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("updateThread", () => {
    const params = {
      id: THREAD_ID,
      name: "Updated Thread Name",
      body: "<b>This is an updated thread body</b>",
    };
    beforeEach(async () => {
      await spaceClient.updateThread(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/space/thread.json");
    });
    it("should send a PUT request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass id, name, body to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("addThreadComment", () => {
    const params: ThreadComment = {
      space: "1",
      thread: "2",
      comment: {
        text: "This is a comment",
        mentions: [
          {
            code: "user1",
            type: "USER",
          },
        ],
      },
    };
    beforeEach(async () => {
      await spaceClient.addThreadComment(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/space/thread/comment.json",
      );
    });
    it("should send a POST request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass space, thread, comment to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("addGuests", () => {
    const params = {
      guests: [
        {
          name: "John Doe",
          code: "johndoe@gmail.com",
          password: "password123",
          timezone: "America/Los_Angeles",
          locale: "en" as const,
          image: "image",
          surNameReading: "Doe",
          givenNameReading: "John",
          company: "company",
          division: "division",
          phone: "phone",
          callto: "callto",
        },
      ],
    };
    beforeEach(async () => {
      await spaceClient.addGuests(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/guests.json");
    });
    it("should send a POST request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass guests to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("deleteGuests", () => {
    const params = {
      guests: ["abc1@gmail.com", "abc2@gmail.com", "abc3@gmail.com"],
    };
    beforeEach(async () => {
      await spaceClient.deleteGuests(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/guests.json");
    });
    it("should send a DELETE request", () => {
      expect(mockClient.getLogs()[0].method).toBe("delete");
    });
    it("should pass guests to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("updateSpaceGuests", () => {
    const params = {
      id: 2,
      guests: [
        "guestUser1@gmail.com",
        "guestUser2@gmail.com",
        "guestUser3@gmail.com",
      ],
    };
    beforeEach(async () => {
      await spaceClient.updateSpaceGuests(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/space/guests.json");
    });
    it("should send a PUT request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass id, guests to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("addSpaceFromTemplate", () => {
    const params = {
      id: SPACE_TEMPLATE_ID,
      name: "Space from Template",
      members: [
        {
          entity: {
            code: "user1",
            type: "USER" as const,
          },
          isAdmin: true,
        },
        {
          entity: {
            code: "user2",
            type: "USER" as const,
          },
          isAdmin: false,
        },
        {
          entity: {
            code: "group1",
            type: "GROUP" as const,
          },
          isAdmin: false,
          includeSubs: true,
        },
      ],
      isPrivate: true,
      isGuest: false,
    };
    beforeEach(async () => {
      await spaceClient.addSpaceFromTemplate(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/template/space.json");
    });
    it("should send a POST request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass correct parameters to the http client", () => {
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
