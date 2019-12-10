import { MockClient } from "../../http/MockClient";
import { AppClient } from "../AppClient";

describe("AppClient", () => {
  let mockClient: MockClient;
  let appClient: AppClient;
  const APP_ID = 1;
  const REVISION = 5;
  const RECORD_ID = 3;
  const properties = {
    fieldCode: {
      type: "SINGLE_LINE_TEXT",
      code: "fieldCode",
      label: "Text Field"
    }
  };

  const layout = [
    {
      type: "ROW",
      fields: [
        {
          type: "SINGLE_LINE_TEXT",
          code: "fieldCode1",
          size: { width: "100" }
        }
      ]
    },
    {
      type: "SUBTABLE",
      code: "tableFieldCode",
      fields: [
        {
          type: "MULTI_LINE_TEXT",
          code: "fieldCode2",
          size: { width: "150", innerHeight: "200" }
        }
      ]
    }
  ];

  const views = {
    view1: {
      type: "LIST" as const,
      index: 0,
      name: "view1",
      fields: ["field"],
      filterCond: 'field = "foo"',
      sort: "sortField desc"
    },
    view2: {
      type: "CALENDAR" as const,
      index: 1,
      name: "view2",
      date: "dateField",
      title: "titleField",
      filterCond: 'field = "bar"',
      sort: "sortField asc"
    },
    view3: {
      type: "CUSTOM" as const,
      index: 2,
      name: "view3",
      html: "<div>Hello!</div>",
      pager: true,
      device: "DESKTOP" as const
    }
  };

  beforeEach(() => {
    mockClient = new MockClient();
    appClient = new AppClient(mockClient);
  });
  describe("getFormFields", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(() => {
        appClient.getFormFields(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/app/form/fields.json");
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and lang as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
    describe("preview: true", () => {
      beforeEach(() => {
        appClient.getFormFields({ ...params, preview: true });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/form/fields.json"
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

  describe("addFormFields", () => {
    const params = { app: APP_ID, properties, revision: REVISION };
    beforeEach(() => {
      appClient.addFormFields(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/form/fields.json"
      );
    });
    it("should send a post request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass app, properties and revision as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("updateFormFields", () => {
    const params = { app: APP_ID, properties, revision: REVISION };
    beforeEach(() => {
      appClient.updateFormFields(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/form/fields.json"
      );
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app, properties and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("deleteFormFields", () => {
    const fields = ["fieldCode1", "fieldCode2"];
    const params = { app: APP_ID, fields, revision: REVISION };
    beforeEach(() => {
      appClient.deleteFormFields(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/form/fields.json"
      );
    });
    it("should send a delete request", () => {
      expect(mockClient.getLogs()[0].method).toBe("delete");
    });
    it("should pass app, fields, and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("getFormLayout", () => {
    const params = { app: APP_ID };
    describe("without preview", () => {
      beforeEach(() => {
        appClient.getFormLayout(params);
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
      beforeEach(() => {
        appClient.getFormLayout({ ...params, preview: true });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/form/layout.json"
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

    beforeEach(() => {
      appClient.updateFormLayout(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/form/layout.json"
      );
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app, layout and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("getViews", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(() => {
        appClient.getViews(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/app/views.json");
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and lang as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
    describe("preview: true", () => {
      beforeEach(() => {
        appClient.getViews({ ...params, preview: true });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/views.json"
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

  describe("updateViews", () => {
    const params = { app: APP_ID, views, revision: REVISION };
    beforeEach(() => {
      appClient.updateViews(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/preview/app/views.json");
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app, views and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("getApp", () => {
    const params = {
      id: APP_ID
    };
    beforeEach(() => {
      appClient.getApp(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/app.json");
    });
    it("should send a get request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass id as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("getApps", () => {
    const params = {
      ids: [APP_ID],
      codes: ["APP"],
      name: "app",
      spaceIds: [1, 2],
      limit: 100,
      offset: 30
    };
    beforeEach(() => {
      appClient.getApps(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/apps.json");
    });
    it("should send a get request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass ids, codes, name, spaceIds, limit, and offset as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("addApp", () => {
    const params = {
      name: "app",
      space: 10,
      thread: 20
    };
    beforeEach(() => {
      appClient.addApp(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/preview/app.json");
    });
    it("should send a post request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass name, space, and thread as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("getDeployStatus", () => {
    const params = {
      apps: [APP_ID]
    };
    beforeEach(() => {
      appClient.getDeployStatus(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/deploy.json"
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
      revert: true
    };
    beforeEach(() => {
      appClient.deployApp(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/deploy.json"
      );
    });
    it("should send a post request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass apps and revert as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
  describe("evaluateRecordsAcl", () => {
    const params = {
      app: APP_ID,
      ids: [RECORD_ID]
    };
    beforeEach(() => {
      appClient.evaluateRecordsAcl(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/records/acl/evaluate.json"
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
