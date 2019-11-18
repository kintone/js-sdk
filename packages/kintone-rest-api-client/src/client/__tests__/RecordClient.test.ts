import { RecordClient } from "../RecordClient";
import { MockClient } from "../../http/MockClient";

describe("RecordClient", () => {
  let mockClient: MockClient;
  let recordClient: RecordClient;
  const APP_ID = 1;
  const RECORD_ID = 2;
  const record = {
    Customer: {
      value: "ABC Corporation"
    }
  };

  beforeEach(() => {
    mockClient = new MockClient();
    recordClient = new RecordClient(mockClient);
  });
  describe("getRecord", () => {
    const params = { app: APP_ID, id: RECORD_ID };
    beforeEach(() => {
      recordClient.getRecord(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/record.json");
    });
    it("should send a get request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass app and id as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("addRecord", () => {
    const params = { app: APP_ID, record };
    beforeEach(() => {
      recordClient.addRecord(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/record.json");
    });
    it("should send a post request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass app and record object as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("updateRecord", () => {
    const params = {
      app: APP_ID,
      id: RECORD_ID,
      record,
      revision: 5
    };
    beforeEach(() => {
      recordClient.updateRecord(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/record.json");
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app, id, record, and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("deleteRecords", () => {
    const ids = [10, 20, 30];
    const revisions = [1, 2, 3];
    const params = {
      app: APP_ID,
      ids,
      revisions
    };
    beforeEach(() => {
      recordClient.deleteRecords(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/records.json");
    });
    it("should send a delete request", () => {
      expect(mockClient.getLogs()[0].method).toBe("delete");
    });
    it("should pass app, ids, and revisions to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});
