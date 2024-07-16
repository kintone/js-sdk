import type { MockClient } from "../../../http/MockClient";
import type { AppClient } from "../../AppClient";
import { APP_ID, makeClients, REVISION } from "../fixtures/AppClientFixture";

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

describe("FormLayout Test", () => {
  let mockClient: MockClient;
  let appClient: AppClient;

  beforeEach(() => {
    const clients = makeClients();
    appClient = clients.appClient;
    mockClient = clients.mockClient;
  });

  describe("getFormLayout", () => {
    const params = { app: APP_ID };
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getFormLayout(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/app/form/layout.json");
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getFormLayout({ ...params, preview: true });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/form/layout.json",
        );
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
  });

  describe("updateFormLayout", () => {
    const params = { app: APP_ID, layout, revision: REVISION };

    beforeEach(async () => {
      await appClient.updateFormLayout(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/form/layout.json",
      );
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app, layout and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});
