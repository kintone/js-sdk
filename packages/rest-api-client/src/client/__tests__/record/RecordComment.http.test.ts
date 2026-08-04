import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { RecordClient } from "../../RecordClient";
import {
  APP_ID,
  expectRequest,
  makeHttpClients,
  RECORD_ID,
  wireParams,
} from "../fixtures/RecordClientHttpFixture";

describe("RecordComment (HTTP level)", () => {
  let httpServer: HttpTestServer;
  let recordClient: RecordClient;

  beforeEach(() => {
    const clients = makeHttpClients();
    recordClient = clients.recordClient;
    httpServer = clients.httpServer;
  });

  afterEach(() => {
    httpServer.close();
  });

  describe("addRecordComment", () => {
    const params = {
      app: APP_ID,
      record: RECORD_ID,
      comment: {
        text: "hello",
        mentions: [
          {
            code: "Administrator",
            type: "USER" as const,
          },
        ],
      },
    };
    beforeEach(async () => {
      await recordClient.addRecordComment(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/record/comment.json",
        body: params,
      });
    });
  });

  describe("deleteRecordComment", () => {
    const params = {
      app: APP_ID,
      record: RECORD_ID,
      comment: "1",
    };
    beforeEach(async () => {
      await recordClient.deleteRecordComment(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "delete",
        path: "/k/v1/record/comment.json",
        query: wireParams(params),
      });
    });
  });

  describe("getRecordComments", () => {
    const params = {
      app: APP_ID,
      record: RECORD_ID,
      order: "desc" as const,
      offset: 5,
      limit: 5,
    };
    beforeEach(async () => {
      await recordClient.getRecordComments(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "get",
        path: "/k/v1/record/comments.json",
        query: wireParams(params),
      });
    });
  });
});
