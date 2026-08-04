import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { AppClient } from "../../AppClient";
import {
  APP_ID,
  expectRequest,
  makeHttpClients,
  REVISION,
  wireParams,
} from "../fixtures/AppClientHttpFixture";

const properties = {
  fieldCode: {
    type: "SINGLE_LINE_TEXT" as const,
    code: "fieldCode",
    label: "Text Field",
  },
};

describe("FormField Test (HTTP level)", () => {
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

  describe("getFormFields", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getFormFields(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/app/form/fields.json",
          query: wireParams(params),
        });
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getFormFields({ ...params, preview: true });
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/preview/app/form/fields.json",
          query: wireParams(params),
        });
      });
    });
  });

  describe("addFormFields", () => {
    const params = { app: APP_ID, properties, revision: REVISION };
    beforeEach(async () => {
      await appClient.addFormFields(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "post",
        path: "/k/v1/preview/app/form/fields.json",
        body: params,
      });
    });
  });

  describe("updateFormFields", () => {
    const params = { app: APP_ID, properties, revision: REVISION };
    beforeEach(async () => {
      await appClient.updateFormFields(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/preview/app/form/fields.json",
        body: params,
      });
    });
  });

  describe("deleteFormFields", () => {
    const fields = ["fieldCode1", "fieldCode2"];
    const params = { app: APP_ID, fields, revision: REVISION };
    beforeEach(async () => {
      await appClient.deleteFormFields(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "delete",
        path: "/k/v1/preview/app/form/fields.json",
        query: wireParams(params),
      });
    });
  });
});
