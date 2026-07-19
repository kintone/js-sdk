import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { RecordClient } from "../../RecordClient";
import {
  APP_ID,
  expectRequest,
  fieldCode,
  makeHttpClients,
  wireParams,
} from "../fixtures/RecordClientHttpFixture";

describe("CursorTest (HTTP level)", () => {
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

  describe("createCursor", () => {
    const params = {
      app: APP_ID,
      fields: [fieldCode],
      query: `${fieldCode} = "foo"`,
      size: 10,
    };
    beforeEach(async () => {
      await recordClient.createCursor(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/records/cursor.json",
        body: params,
      });
    });
  });

  describe("getRecordsByCursor", () => {
    const params = {
      id: "cursor id",
    };
    beforeEach(async () => {
      await recordClient.getRecordsByCursor(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "get",
        path: "/k/v1/records/cursor.json",
        query: wireParams(params),
      });
    });
  });

  describe("deleteCursor", () => {
    const params = {
      id: "cursor id",
    };
    beforeEach(async () => {
      await recordClient.deleteCursor(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "delete",
        path: "/k/v1/records/cursor.json",
        query: wireParams(params),
      });
    });
  });
});
