import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { AppClient } from "../../AppClient";
import {
  APP_ID,
  expectRequest,
  makeHttpClients,
  REVISION,
  wireParams,
} from "../fixtures/AppClientHttpFixture";

const layout = [
  {
    type: "ROW" as const,
    fields: [
      {
        type: "SINGLE_LINE_TEXT",
        code: "fieldCode1",
        size: { width: "100" },
      },
      {
        type: "LABEL",
        label: "label1",
        size: { width: "100" },
      },
      {
        type: "SPACER",
        elementId: "space",
        size: { width: "100", height: "50" },
      },
    ],
  },
  {
    type: "SUBTABLE" as const,
    code: "tableFieldCode",
    fields: [
      {
        type: "MULTI_LINE_TEXT",
        code: "fieldCode2",
        size: { width: "150", innerHeight: "200" },
      },
    ],
  },
  {
    type: "GROUP" as const,
    code: "fieldCode3",
    layout: [
      {
        type: "ROW" as const,
        fields: [
          {
            type: "NUMBER",
            code: "fieldCode3_1",
            size: {
              width: 200,
            },
          },
        ],
      },
    ],
  },
];

describe("FormLayout Test (HTTP level)", () => {
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

  describe("getFormLayout", () => {
    const params = { app: APP_ID };
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getFormLayout(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/app/form/layout.json",
          query: wireParams(params),
        });
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getFormLayout({ ...params, preview: true });
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/preview/app/form/layout.json",
          query: wireParams(params),
        });
      });
    });
  });

  describe("updateFormLayout", () => {
    const params = { app: APP_ID, layout, revision: REVISION };

    beforeEach(async () => {
      await appClient.updateFormLayout(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/preview/app/form/layout.json",
        body: params,
      });
    });
  });
});
