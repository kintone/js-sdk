import type { HttpTestServer } from "../fixtures/HttpTestServer";
import type { AppClient } from "../../AppClient";
import {
  APP_ID,
  expectRequest,
  makeHttpClients,
  wireParams,
} from "../fixtures/AppClientHttpFixture";

describe("AppClient: notifications (HTTP level)", () => {
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

  describe("getPerRecordNotifications", () => {
    const params = {
      app: APP_ID,
    };
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getPerRecordNotifications(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/app/notifications/perRecord.json",
          query: wireParams(params),
        });
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getPerRecordNotifications({ ...params, preview: true });
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/preview/app/notifications/perRecord.json",
          query: wireParams(params),
        });
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
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/app/notifications/general.json",
          query: wireParams(params),
        });
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getGeneralNotifications({ ...params, preview: true });
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/preview/app/notifications/general.json",
          query: wireParams(params),
        });
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
          filterCond: 'CREATED_TIME in ("user1")',
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
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/preview/app/notifications/reminder.json",
        body: params,
      });
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
      revision: 1,
    };

    beforeEach(async () => {
      await appClient.updatePerRecordNotifications(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/preview/app/notifications/perRecord.json",
        body: params,
      });
    });
  });

  describe("getReminderNotifications", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getReminderNotifications(params);
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/app/notifications/reminder.json",
          query: wireParams(params),
        });
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getReminderNotifications({
          ...params,
          preview: true,
        });
      });
      it("should send the exact request over the wire", () => {
        expectRequest(httpServer, 0, {
          method: "get",
          path: "/k/v1/preview/app/notifications/reminder.json",
          query: wireParams(params),
        });
      });
    });
  });
  describe("updateGeneralNotifications", () => {
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
        },
      ],
      notifyToCommenter: true,
      revision: 1,
    };
    beforeEach(async () => {
      await appClient.updateGeneralNotifications(params);
    });
    it("should send the exact request over the wire", () => {
      expectRequest(httpServer, 0, {
        method: "put",
        path: "/k/v1/preview/app/notifications/general.json",
        body: params,
      });
    });
  });
});
