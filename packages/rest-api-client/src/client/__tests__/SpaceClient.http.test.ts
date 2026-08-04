import type { HttpTestServer } from "./fixtures/HttpTestServer";
import type { SpaceClient } from "../SpaceClient";
import type { ThreadComment, UpdateSpaceForRequest } from "../types";
import {
  expectRequest,
  makeHttpClients,
  wireParams,
} from "./fixtures/SpaceClientHttpFixture";

const SPACE_ID = 1;
const SPACE_TEMPLATE_ID = 1;
const THREAD_ID = 1;

describe("SpaceClient (HTTP level)", () => {
  let httpServer: HttpTestServer;
  let spaceClient: SpaceClient;

  beforeEach(() => {
    const clients = makeHttpClients();
    spaceClient = clients.spaceClient;
    httpServer = clients.httpServer;
  });

  afterEach(() => {
    httpServer.close();
  });

  describe("getSpace", () => {
    const params = {
      id: SPACE_ID,
    };
    beforeEach(async () => {
      await spaceClient.getSpace(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "get",
        path: "/k/v1/space.json",
        query: wireParams(params),
      });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/space.json",
        body: params,
      });
    });
  });

  describe("deleteSpace", () => {
    const params = {
      id: SPACE_ID,
    };
    beforeEach(async () => {
      await spaceClient.deleteSpace(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "delete",
        path: "/k/v1/space.json",
        query: wireParams(params),
      });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/space/body.json",
        body: params,
      });
    });
  });

  describe("getSpaceMembers", () => {
    const params = {
      id: SPACE_ID,
    };
    beforeEach(async () => {
      await spaceClient.getSpaceMembers(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "get",
        path: "/k/v1/space/members.json",
        query: wireParams(params),
      });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/space/members.json",
        body: params,
      });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/space/thread.json",
        body: params,
      });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/space/thread.json",
        body: params,
      });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/space/thread/comment.json",
        body: params,
      });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/guests.json",
        body: params,
      });
    });
  });

  describe("deleteGuests", () => {
    const params = {
      guests: ["abc1@gmail.com", "abc2@gmail.com", "abc3@gmail.com"],
    };
    beforeEach(async () => {
      await spaceClient.deleteGuests(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "delete",
        path: "/k/v1/guests.json",
        query: wireParams(params),
      });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/space/guests.json",
        body: params,
      });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/template/space.json",
        body: params,
      });
    });
  });

  describe("getStatistics", () => {
    describe("empty parameters", () => {
      beforeEach(async () => {
        await spaceClient.getStatistics({});
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/spaces/statistics.json",
        });
      });
    });

    describe("with offset and limit parameters", () => {
      const params = {
        offset: 10,
        limit: 50,
      };
      beforeEach(async () => {
        await spaceClient.getStatistics(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/spaces/statistics.json",
          query: wireParams(params),
        });
      });
    });
  });
});

describe("SpaceClient with guestSpaceId (HTTP level)", () => {
  it("should send the guest space path over the wire", async () => {
    const GUEST_SPACE_ID = 2;
    const params = { id: GUEST_SPACE_ID };
    const clients = makeHttpClients(GUEST_SPACE_ID);
    try {
      await clients.spaceClient.getSpace(params);
      expectRequest(clients.httpServer, 0, {
        method: "get",
        path: `/k/guest/${GUEST_SPACE_ID}/v1/space.json`,
        query: wireParams(params),
      });
    } finally {
      clients.httpServer.close();
    }
  });
});
