import { MockClient, buildMockClient } from "../../http/MockClient";
import { AppClient } from "../AppClient";
import { KintoneRequestConfigBuilder } from "../../KintoneRequestConfigBuilder";

const APP_ID = 1;
const REVISION = 5;
const RECORD_ID = 3;
const properties = {
  fieldCode: {
    type: "SINGLE_LINE_TEXT" as const,
    code: "fieldCode",
    label: "Text Field",
  },
};

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

const views = {
  view1: {
    type: "LIST" as const,
    index: 0,
    name: "view1",
    fields: ["field"],
    filterCond: 'field = "foo"',
    sort: "sortField desc",
  },
  view2: {
    type: "CALENDAR" as const,
    index: 1,
    name: "view2",
    date: "dateField",
    title: "titleField",
    filterCond: 'field = "bar"',
    sort: "sortField asc",
  },
  view3: {
    type: "CUSTOM" as const,
    index: 2,
    name: "view3",
    html: "<div>Hello!</div>",
    pager: true,
    device: "DESKTOP" as const,
  },
};

const states = {
  status1: {
    name: "status1",
    index: 0,
    assignee: {
      type: "ONE" as const,
      entities: [
        { entity: { type: "FIELD_ENTITY" as const, code: "creator" } },
      ],
    },
  },
  status2: {
    name: "status2",
    index: 1,
    assignee: {
      type: "ANY" as const,
      entities: [{ entity: { type: "CREATOR" as const } }],
    },
  },
  status3: {
    name: "status3",
    index: 2,
    assignee: {
      type: "ALL" as const,
      entities: [
        { entity: { type: "USER" as const, code: "user1" } },
        { entity: { type: "USER" as const, code: "user2" } },
      ],
    },
  },
};
const actions = [
  { name: "action1to2", from: "status1", to: "status2" },
  {
    name: "action2to3",
    from: "status2",
    to: "status3",
    filterCond: 'field = "foo"',
  },
];

describe("AppClient", () => {
  let mockClient: MockClient;
  let appClient: AppClient;

  beforeEach(() => {
    const requestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl: "https://example.cybozu.com",
      auth: { type: "apiToken", apiToken: "foo" },
    });
    mockClient = buildMockClient(requestConfigBuilder);
    appClient = new AppClient(mockClient);
  });
  describe("getFormFields", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getFormFields(params);
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
      beforeEach(async () => {
        await appClient.getFormFields({ ...params, preview: true });
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
    beforeEach(async () => {
      await appClient.addFormFields(params);
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
    beforeEach(async () => {
      await appClient.updateFormFields(params);
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
    beforeEach(async () => {
      await appClient.deleteFormFields(params);
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

    beforeEach(async () => {
      await appClient.updateFormLayout(params);
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
      beforeEach(async () => {
        await appClient.getViews(params);
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
      beforeEach(async () => {
        await appClient.getViews({ ...params, preview: true });
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
    beforeEach(async () => {
      await appClient.updateViews(params);
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
      id: APP_ID,
    };
    beforeEach(async () => {
      await appClient.getApp(params);
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
      offset: 30,
    };
    beforeEach(async () => {
      await appClient.getApps(params);
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
    describe("without space", () => {
      const params = {
        name: "app",
      };
      beforeEach(async () => {
        await appClient.addApp(params);
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
    describe("with space", () => {
      const params = {
        name: "app",
        space: 10,
      };
      const defaultThread = 20;
      beforeEach(async () => {
        mockClient.mockResponse({ defaultThread });
        await appClient.addApp(params);
      });
      it("should fetch the default thread of the space", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/space.json");
        expect(mockClient.getLogs()[0].method).toBe("get");
        expect(mockClient.getLogs()[0].params).toEqual({ id: params.space });
      });
      it("should add new app into the default thread", () => {
        expect(mockClient.getLogs()[1].path).toBe("/k/v1/preview/app.json");
        expect(mockClient.getLogs()[1].method).toBe("post");
        expect(mockClient.getLogs()[1].params).toEqual({
          ...params,
          thread: defaultThread,
        });
      });
    });
  });

  describe("getProcessManagement", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getProcessManagement(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/app/status.json");
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and lang to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getProcessManagement({ ...params, preview: true });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/status.json"
        );
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and lang to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
  });

  describe("updateProcessManagement", () => {
    const params = {
      app: APP_ID,
      revision: REVISION,
      enable: true,
      states,
      actions,
    };
    beforeEach(async () => {
      await appClient.updateProcessManagement(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/status.json"
      );
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app, states, actions and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("getAppSettings", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getAppSettings(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/app/settings.json");
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and lang to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getAppSettings({ ...params, preview: true });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/settings.json"
        );
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and lang to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
  });

  describe("updateAppSettings", () => {
    const params = {
      app: APP_ID,
      revision: REVISION,
      name: "test app",
      description: "<div>Description</div>",
      icon: {
        type: "FILE" as const,
        file: {
          fileKey: "file key",
        },
      },
      theme: "WHITE" as const,
    };
    beforeEach(async () => {
      await appClient.updateAppSettings(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/settings.json"
      );
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app, name, description, icon, theme and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
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
      revert: true,
    };
    beforeEach(async () => {
      await appClient.deployApp(params);
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
          "/k/v1/preview/record/acl.json"
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
        "/k/v1/preview/record/acl.json"
      );
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app, right and revision as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("getPerRecordNotifications", () => {
    const params = {
      app: APP_ID,
    };
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getPerRecordNotifications(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/app/notifications/perRecord.json"
        );
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
        await appClient.getPerRecordNotifications({ ...params, preview: true });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/notifications/perRecord.json"
        );
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and preview as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
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

  describe("getAppCustomize", () => {
    const params = { app: APP_ID };
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getAppCustomize(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/app/customize.json");
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
        await appClient.getAppCustomize({ ...params, preview: true });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/customize.json"
        );
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and preview as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
  });

  describe("updateAppCustomize", () => {
    const resource = {
      js: [
        {
          type: "URL" as const,
          url: "https://www.example.com/example-mobile.js",
        },
      ],
      css: [
        {
          type: "FILE" as const,
          file: {
            fileKey: "ddfc8e89-7aa3-4350-b9ab-3a75c9cf46b3",
          },
        },
      ],
    };
    const params = {
      app: APP_ID,
      scope: "ALL" as const,
      desktop: resource,
      mobile: resource,
      revision: REVISION,
    };
    describe("customize resources are specified", () => {
      beforeEach(async () => {
        await appClient.updateAppCustomize(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/customize.json"
        );
      });
      it("should send a put request", () => {
        expect(mockClient.getLogs()[0].method).toBe("put");
      });
      it("should pass app, scope, desktop, mobile and revision as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
  });

  describe("getGeneralNotifications", () => {
    const params = {
      app: APP_ID,
    };
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getGeneralNotifications(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/app/notifications/general.json"
        );
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
        await appClient.getGeneralNotifications({ ...params, preview: true });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/notifications/general.json"
        );
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and preview as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
  });

  describe("updateReminderNotifications", () => {
    const params = {
      app: 1,
      notifications: [
        {
          timing: {
            code: "CREATED_TIME",
            daysLater: "1",
            hoursLater: "2",
          },
          filterCond: 'CREATED_TIME in ("user1)',
          title: "test title1",
          targets: [
            {
              entity: {
                type: "USER",
                code: "user1",
              } as const,
              includeSubs: false,
            },
          ],
        },
        {
          timing: {
            code: "CREATED_TIME",
            daysLater: "-3",
            time: "08:30",
          },
          filterCond: 'CREATED_TIME in ("user1")',
          title: "test title2",
          targets: [
            {
              entity: {
                type: "USER",
                code: "user1",
              } as const,
              includeSubs: false,
            },
          ],
        },
      ],
      timezone: "Asia/Tokyo",
      revision: "2",
    };
    beforeEach(async () => {
      await appClient.updateReminderNotifications(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/notifications/reminder.json"
      );
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app and rights as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("updatePerRecordNotifications", () => {
    const params = {
      app: APP_ID,
      notifications: [
        {
          filterCond: 'Customer = "foo"',
          title: "Send a notification",
          targets: [
            {
              entity: {
                type: "USER" as const,
                code: "foo",
              },
              includeSubs: false,
            },
          ],
        },
      ],
      notifyToCommenter: true,
      revision: 1,
    };

    beforeEach(async () => {
      await appClient.updatePerRecordNotifications(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/notifications/perRecord.json"
      );
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app and rights as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("getAppNotificationsReminder", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getReminderNotifications(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/app/notifications/reminder.json"
        );
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
        await appClient.getReminderNotifications({
          ...params,
          preview: true,
        });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/notifications/reminder.json"
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
  describe("updateAppUpdateGeneralNotifications", () => {
    const params = {
      app: APP_ID,
      notifications: [
        {
          entity: {
            type: "USER" as const,
            code: "foo",
          },
          includeSubs: true,
          recordAdded: true,
          recordEdited: true,
          commentAdded: true,
          statusChanged: true,
          fileImported: true,
          notifyToCommenter: true,
        },
      ],
      notifyToCommenter: true,
      revision: 1,
    };
    beforeEach(async () => {
      await appClient.updateGeneralNotifications(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/notifications/general.json"
      );
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app and rights as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("updateReports", () => {
    const params = {
      app: 1,
      reports: {
        "Graph 1": {
          chartType: "BAR" as const,
          chartMode: "NORMAL" as const,
          name: "Graph 1",
          index: 0,
          groups: [
            {
              code: "Radio_button",
            },
          ],
          aggregations: [
            {
              type: "COUNT" as const,
            },
          ],
          filterCond: "",
          sorts: [
            {
              by: "TOTAL" as const,
              order: "DESC" as const,
            },
          ],
          periodicReport: {
            active: true,
            period: {
              every: "QUARTER" as const,
              pattern: "JAN_APR_JUL_OCT" as const,
              dayOfMonth: "END_OF_MONTH" as const,
              time: "23:30",
            },
          },
        },
      },
    };
    beforeEach(async () => {
      await appClient.updateReports(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/reports.json"
      );
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app and rights as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});

describe("AppClient with guestSpaceId", () => {
  it("should pass the path to the http client", async () => {
    const GUEST_SPACE_ID = 2;
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    const requestConfigBuilder = new KintoneRequestConfigBuilder({
      baseUrl: "https://example.cybozu.com",
      auth: { type: "session" },
    });
    const mockClient = buildMockClient(requestConfigBuilder);
    const appClient = new AppClient(mockClient, GUEST_SPACE_ID);
    await appClient.getFormFields(params);
    expect(mockClient.getLogs()[0].path).toBe(
      `/k/guest/${GUEST_SPACE_ID}/v1/app/form/fields.json`
    );
  });
});
