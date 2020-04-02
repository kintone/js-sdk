import { MockClient } from "../../http/MockClient";
import { BulkRequestClient } from "../BulkRequestClient";

describe("BulkRequestClient", () => {
  let mockClient: MockClient;
  let bulkRequestClient: BulkRequestClient;
  const APP_ID = 1;
  const RECORD_ID = 2;
  const fieldCode = "Customer";
  const record = {
    [fieldCode]: {
      value: "ABC Corporation",
    },
  };

  beforeEach(() => {
    mockClient = new MockClient();
    bulkRequestClient = new BulkRequestClient(mockClient);
  });
  describe("send", () => {
    const params = {
      requests: [
        {
          method: "POST",
          api: "/k/v1/record.json",
          payload: {
            app: APP_ID,
            record,
          },
        },
        {
          method: "DELETE",
          api: "/k/v1/records.json",
          payload: {
            app: APP_ID,
            ids: [RECORD_ID],
          },
        },
      ],
    };
    beforeEach(() => {
      bulkRequestClient.send(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/bulkRequest.json");
    });
    it("should send a post request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass requests to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});

describe("BulkRequestClient with guestSpaceId", () => {
  it("should pass the path to the http client", () => {
    const APP_ID = 1;
    const GUEST_SPACE_ID = 2;

    const mockClient = new MockClient();
    const bulkRequestClient = new BulkRequestClient(mockClient, GUEST_SPACE_ID);
    const params = {
      requests: [
        {
          method: "POST",
          api: "/k/v1/record.json",
          payload: {
            app: APP_ID,
            record: {
              Customer: {
                value: "ABC Corporation",
              },
            },
          },
        },
      ],
    };
    bulkRequestClient.send(params);
    expect(mockClient.getLogs()[0].path).toBe(
      `/k/guest/${GUEST_SPACE_ID}/v1/bulkRequest.json`
    );
  });
});
