import { buildMockClient } from "../../../http/MockClient";
import { KintoneRequestConfigBuilder } from "../../../KintoneRequestConfigBuilder";
import { AppClient } from "../../AppClient";
import type { SpaceID } from "../../types";

export const makeClients = (guestSpaceId?: SpaceID) => {
  const requestConfigBuilder = new KintoneRequestConfigBuilder({
    baseUrl: "https://example.cybozu.com",
    auth: { type: "apiToken", apiToken: "foo" },
  });
  const mockClient = buildMockClient(requestConfigBuilder);
  const appClient = new AppClient(mockClient, guestSpaceId);
  return {
    appClient: appClient,
    mockClient: mockClient,
  };
};

export const APP_ID = 1;
export const REVISION = 5;
