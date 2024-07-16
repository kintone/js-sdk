import type { MockClient } from "../../../http/MockClient";
import type { AppClient } from "../../AppClient";
import { APP_ID, makeClients } from "../fixtures/AppClientFixture";

describe("RecordNotification", () => {
  let mockClient: MockClient;
  let appClient: AppClient;

  beforeEach(() => {
    const clients = makeClients();
    appClient = clients.appClient;
    mockClient = clients.mockClient;
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
          "/k/v1/app/notifications/perRecord.json",
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
          "/k/v1/preview/app/notifications/perRecord.json",
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
          "/k/v1/app/notifications/general.json",
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
          "/k/v1/preview/app/notifications/general.json",
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
        "/k/v1/preview/app/notifications/reminder.json",
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
      revision: 1,
    };

    beforeEach(async () => {
      await appClient.updatePerRecordNotifications(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/notifications/perRecord.json",
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
          "/k/v1/app/notifications/reminder.json",
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
          "/k/v1/preview/app/notifications/reminder.json",
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
        "/k/v1/preview/app/notifications/general.json",
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
