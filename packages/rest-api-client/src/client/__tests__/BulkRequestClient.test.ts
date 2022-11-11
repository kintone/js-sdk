import type { MockClient } from "../../http/MockClient";
import { buildMockClient } from "../../http/MockClient";
import { BulkRequestClient } from "../BulkRequestClient";
import { KintoneRequestConfigBuilder } from "../../KintoneRequestConfigBuilder";

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
    const requestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl: "https://example.cybozu.com",
      auth: { type: "apiToken", apiToken: "foo" },
    });
    mockClient = buildMockClient(requestConfigBuilder);
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
    beforeEach(async () => {
      await bulkRequestClient.send(params);
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

  describe("send with endpointName", () => {
    const params = {
      requests: [
        {
          method: "POST",
          endpointName: "record" as const,
          payload: {
            app: APP_ID,
            record,
          },
        },
        {
          method: "DELETE",
          endpointName: "records" as const,
          payload: {
            app: APP_ID,
            ids: [RECORD_ID],
          },
        },
      ],
    };
    const expected = {
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

    beforeEach(async () => {
      await bulkRequestClient.send(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/bulkRequest.json");
    });
    it("should send a post request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass requests with the path corresponding to the endpointName to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(expected);
    });
  });
});

describe("BulkRequestClient with guestSpaceId", () => {
  let mockClient: MockClient;
  let bulkRequestClient: BulkRequestClient;
  const APP_ID = 1;
  const GUEST_SPACE_ID = 2;
  beforeEach(() => {
    const requestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl: "https://example.cybozu.com",
      auth: { type: "apiToken", apiToken: "foo" },
    });
    mockClient = buildMockClient(requestConfigBuilder);
    bulkRequestClient = new BulkRequestClient(mockClient, GUEST_SPACE_ID);
  });
  it("should pass the path to the http client", async () => {
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
    await bulkRequestClient.send(params);
    expect(mockClient.getLogs()[0].path).toBe(
      `/k/guest/${GUEST_SPACE_ID}/v1/bulkRequest.json`
    );
  });
  it("should pass the path as a param with the guest space id to the http client", async () => {
    const params = {
      requests: [
        {
          method: "POST",
          endpointName: "record" as const,
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
    await bulkRequestClient.send(params);
    expect(mockClient.getLogs()[0].params.requests[0].api).toEqual(
      `/k/guest/${GUEST_SPACE_ID}/v1/record.json`
    );
  });
});
