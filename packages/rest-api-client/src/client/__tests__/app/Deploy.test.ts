import type { MockClient } from "../../../http/MockClient";
import type { AppClient } from "../../AppClient";
import { APP_ID, makeClients, REVISION } from "../fixtures/AppClientFixture";

describe("Deploy", () => {
  let mockClient: MockClient;
  let appClient: AppClient;

  beforeEach(() => {
    const clients = makeClients();
    appClient = clients.appClient;
    mockClient = clients.mockClient;
  });

  describe("getDeployStatus", () => {
    const params = {
      apps: [APP_ID],
    };
    beforeEach(async () => {
      await appClient.getDeployStatus(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/deploy.json",
      );
    });
    it("should send a get request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass apps as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("deployApp", () => {
    const params = {
      apps: [{ app: APP_ID, revision: REVISION }],
      revert: true,
    };
    beforeEach(async () => {
      await appClient.deployApp(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/deploy.json",
      );
    });
    it("should send a post request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass apps and revert as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});
