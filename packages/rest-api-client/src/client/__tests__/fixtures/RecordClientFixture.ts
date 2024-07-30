import { buildMockClient } from "../../../http/MockClient";
import { KintoneRequestConfigBuilder } from "../../../KintoneRequestConfigBuilder";
import { BulkRequestClient } from "../../BulkRequestClient";
import { RecordClient } from "../../RecordClient";
import type { SpaceID } from "../../types";

export const makeClients = (guestSpaceId?: SpaceID) => {
  const requestConfigBuilder = new KintoneRequestConfigBuilder({
    baseUrl: "https://example.cybozu.com",
    auth: { type: "apiToken", apiToken: "foo" },
  });
  const mockClient = buildMockClient(requestConfigBuilder);
  const bulkRequestClient = new BulkRequestClient(mockClient);
  const recordClient = new RecordClient(
    mockClient,
    bulkRequestClient,
    guestSpaceId,
  );

  return {
    recordClient: recordClient,
    mockClient: mockClient,
  };
};

export const APP_ID = 1;
export const RECORD_ID = 2;

export const fieldCode = "Customer";
export const record = {
  [fieldCode]: {
    value: "ABC Corporation",
  },
};
