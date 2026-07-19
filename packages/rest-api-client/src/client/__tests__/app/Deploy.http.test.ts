import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { AppClient } from "../../AppClient";
import {
  APP_ID,
  expectRequest,
  makeHttpClients,
  REVISION,
  wireParams,
} from "../fixtures/AppClientHttpFixture";

describe("Deploy (HTTP level)", () => {
  let httpServer: HttpTestServer;
  let appClient: AppClient;

  beforeEach(() => {
    const clients = makeHttpClients();
    appClient = clients.appClient;
    httpServer = clients.httpServer;
  });

  afterEach(() => {
    httpServer.close();
  });

  describe("getDeployStatus", () => {
    const params = {
      apps: [APP_ID],
    };
    beforeEach(async () => {
      await appClient.getDeployStatus(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "get",
        path: "/k/v1/preview/app/deploy.json",
        query: wireParams(params),
      });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/preview/app/deploy.json",
        body: params,
      });
    });
  });
});
