import type { HttpTestServer } from "./fixtures/HttpTestServer";
import type { BulkRequestClient } from "../BulkRequestClient";
import {
  expectRequest,
  makeHttpClients,
} from "./fixtures/BulkRequestClientHttpFixture";

describe("BulkRequestClient (HTTP level)", () => {
  let httpServer: HttpTestServer;
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
    const clients = makeHttpClients();
    bulkRequestClient = clients.bulkRequestClient;
    httpServer = clients.httpServer;
  });

  afterEach(() => {
    httpServer.close();
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/bulkRequest.json",
        body: params,
      });
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
    it("should send requests with the path corresponding to the endpointName over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/bulkRequest.json",
        body: expected,
      });
    });
  });
});

describe("BulkRequestClient with guestSpaceId (HTTP level)", () => {
  const APP_ID = 1;
  const GUEST_SPACE_ID = 2;

  it("should send the guest space path over the wire", async () => {
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
    const clients = makeHttpClients(GUEST_SPACE_ID);
    try {
      await clients.bulkRequestClient.send(params);
      expectRequest(clients.httpServer, 0, {
        method: "post",
        path: `/k/guest/${GUEST_SPACE_ID}/v1/bulkRequest.json`,
        body: params,
      });
    } finally {
      clients.httpServer.close();
    }
  });

  it("should send the path with the guest space id for the endpointName-based request over the wire", async () => {
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
    const expected = {
      requests: [
        {
          method: "POST",
          api: `/k/guest/${GUEST_SPACE_ID}/v1/record.json`,
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
    const clients = makeHttpClients(GUEST_SPACE_ID);
    try {
      await clients.bulkRequestClient.send(params);
      expectRequest(clients.httpServer, 0, {
        method: "post",
        path: `/k/guest/${GUEST_SPACE_ID}/v1/bulkRequest.json`,
        body: expected,
      });
    } finally {
      clients.httpServer.close();
    }
  });
});
