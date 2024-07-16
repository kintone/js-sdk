import type { MockClient } from "../../../http/MockClient";
import type { AppClient } from "../../AppClient";
import { APP_ID, makeClients, REVISION } from "../fixtures/AppClientFixture";

const RECORD_ID = 3;

describe("Acl", () => {
  let mockClient: MockClient;
  let appClient: AppClient;

  beforeEach(() => {
    const clients = makeClients();
    appClient = clients.appClient;
    mockClient = clients.mockClient;
  });

  describe("getFieldAcl", () => {
    const params = {
      app: APP_ID,
    };
    beforeEach(async () => {
      await appClient.getFieldAcl(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/field/acl.json");
    });
    it("should send a get request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass app as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("updateFieldAcl", () => {
    const params = {
      app: APP_ID,
      rights: [
        {
          code: "foo",
          entities: [
            {
              accessibility: "READ" as const,
              entity: {
                code: "bar",
                type: "USER" as const,
              },
            },
          ],
        },
      ],
    };

    beforeEach(async () => {
      await appClient.updateFieldAcl(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/preview/field/acl.json");
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app and rights as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("getRecordAcl", () => {
    const lang = "default";
    const params = {
      app: APP_ID,
      lang,
    } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getRecordAcl(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/record/acl.json");
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and lang as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getRecordAcl({ ...params, preview: true });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/record/acl.json",
        );
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and lang as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
  });

  describe("updateRecordAcl", () => {
    const params = {
      app: APP_ID,
      rights: [
        {
          filterCond: 'field = "foo"',
          entities: [
            {
              entity: {
                code: "bar",
                type: "USER" as const,
              },
              viewable: false,
              editable: false,
              deletable: false,
              includeSubs: true,
            },
          ],
        },
      ],
      revision: REVISION,
    };
    beforeEach(async () => {
      await appClient.updateRecordAcl(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/record/acl.json",
      );
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app, right and revision as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("getAppAcl", () => {
    const params = {
      app: APP_ID,
    };
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getAppAcl(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/app/acl.json");
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
        await appClient.getAppAcl({ ...params, preview: true });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/preview/app/acl.json");
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and preview as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
  });

  describe("updateAppAcl", () => {
    const params = {
      app: APP_ID,
      rights: [
        {
          entity: {
            type: "USER" as const,
            code: "foo",
          },
          appEditable: true,
          recordViewable: true,
          recordAddable: true,
          recordEditable: true,
          recordDeletable: true,
          recordImportable: true,
          recordExportable: true,
        },
      ],
    };
    beforeEach(async () => {
      await appClient.updateAppAcl(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/preview/app/acl.json");
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app and rights as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("evaluateRecordsAcl", () => {
    const params = {
      app: APP_ID,
      ids: [RECORD_ID],
    };
    beforeEach(async () => {
      await appClient.evaluateRecordsAcl(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/records/acl/evaluate.json",
      );
    });
    it("should send a get request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass app and ids as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});
