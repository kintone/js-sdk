import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { AppClient } from "../../AppClient";
import {
  APP_ID,
  expectRequest,
  makeHttpClients,
  REVISION,
  wireParams,
} from "../fixtures/AppClientHttpFixture";

const RECORD_ID = 3;

describe("Acl (HTTP level)", () => {
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

  describe("getFieldAcl", () => {
    const params = {
      app: APP_ID,
    };
    beforeEach(async () => {
      await appClient.getFieldAcl(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "get",
        path: "/k/v1/field/acl.json",
        query: wireParams(params),
      });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/preview/field/acl.json",
        body: params,
      });
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
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/record/acl.json",
          query: wireParams(params),
        });
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getRecordAcl({ ...params, preview: true });
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/preview/record/acl.json",
          query: wireParams(params),
        });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/preview/record/acl.json",
        body: params,
      });
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
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/app/acl.json",
          query: wireParams(params),
        });
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getAppAcl({ ...params, preview: true });
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/preview/app/acl.json",
          query: wireParams(params),
        });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/preview/app/acl.json",
        body: params,
      });
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "get",
        path: "/k/v1/records/acl/evaluate.json",
        query: wireParams(params),
      });
    });
  });
});
