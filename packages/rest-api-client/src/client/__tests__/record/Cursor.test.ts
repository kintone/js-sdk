import type { MockClient } from "../../../http/MockClient";
import type { RecordClient } from "../../RecordClient";
import {
  APP_ID,
  fieldCode,
  makeClients,
} from "../fixtures/RecordClientFixture";

describe("CursorTest", () => {
  let mockClient: MockClient;
  let recordClient: RecordClient;

  beforeEach(() => {
    const clients = makeClients();
    recordClient = clients.recordClient;
    mockClient = clients.mockClient;
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
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/records/cursor.json");
    });
    it("should send a post request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass app, fields, query, and size to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("getRecordsByCursor", () => {
    const params = {
      id: "cursor id",
    };
    beforeEach(async () => {
      await recordClient.getRecordsByCursor(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/records/cursor.json");
    });
    it("should send a get request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass id to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("deleteCursor", () => {
    const params = {
      id: "cursor id",
    };
    beforeEach(async () => {
      await recordClient.deleteCursor(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/records/cursor.json");
    });
    it("should send a delete request", () => {
      expect(mockClient.getLogs()[0].method).toBe("delete");
    });
    it("should pass id to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});
