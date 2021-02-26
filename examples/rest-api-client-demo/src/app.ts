import { KintoneRestAPIClient } from "@kintone/rest-api-client";

const APP_ID = 8;
const RECORD_ID = 3;
const SPACE_ID = 3;

export class App {
  private client: KintoneRestAPIClient;
  constructor(client: KintoneRestAPIClient) {
    this.client = client;
  }
  public async getFormFields() {
    try {
      console.log(await this.client.app.getFormFields({ app: APP_ID }));
    } catch (error) {
      console.log(error);
    }
  }

  public async getFormFieldsPreview() {
    try {
      console.log(
        await this.client.app.getFormFields({ app: APP_ID, preview: true })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async addFormFields() {
    const properties = {
      fieldCode: {
        type: "SINGLE_LINE_TEXT" as const,
        code: "fieldCode",
        label: "Text Field",
      },
    };
    try {
      console.log(
        await this.client.app.addFormFields({ app: APP_ID, properties })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async updateFormFields() {
    const properties = {
      fieldCode: {
        type: "SINGLE_LINE_TEXT" as const,
        label: "Text Field 2",
      },
    };
    try {
      console.log(
        await this.client.app.updateFormFields({ app: APP_ID, properties })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteFormFields() {
    const fields = ["fieldCode"];

    try {
      console.log(
        await this.client.app.deleteFormFields({ app: APP_ID, fields })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async getFormLayout() {
    try {
      console.log(await this.client.app.getFormLayout({ app: APP_ID }));
    } catch (error) {
      console.log(error);
    }
  }

  public async getFormLayoutPreview() {
    try {
      console.log(
        await this.client.app.getFormLayout({ app: APP_ID, preview: true })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async updateFormLayout() {
    try {
      const { layout } = await this.client.app.getFormLayout({
        app: APP_ID,
        preview: true,
      });
      const lastRow = layout.pop();
      if (lastRow) {
        const newLayout = [lastRow, ...layout];

        console.log(
          await this.client.app.updateFormLayout({
            app: APP_ID,
            layout: newLayout,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async getViews() {
    try {
      console.log(await this.client.app.getViews({ app: APP_ID }));
    } catch (error) {
      console.log(error);
    }
  }

  public async getViewsPreview() {
    try {
      console.log(
        await this.client.app.getViews({ app: APP_ID, preview: true })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async updateViews() {
    try {
      const { views } = await this.client.app.getViews({ app: APP_ID });
      const newViews = views;
      console.log(
        await this.client.app.updateViews({ app: APP_ID, views: newViews })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async getAppSettings() {
    try {
      console.log(await this.client.app.getAppSettings({ app: APP_ID }));
    } catch (error) {
      console.log(error);
    }
  }

  public async getAppSettingsPreview() {
    try {
      console.log(
        await this.client.app.getAppSettings({ app: APP_ID, preview: true })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async updateAppSettings() {
    try {
      console.log(await this.client.app.updateAppSettings({ app: APP_ID }));
    } catch (error) {
      console.log(error);
    }
  }

  public async getProcessManagement() {
    try {
      console.log(await this.client.app.getProcessManagement({ app: APP_ID }));
    } catch (error) {
      console.log(error);
    }
  }

  public async updateProcessManagement() {
    try {
      console.log(
        await this.client.app.updateProcessManagement({ app: APP_ID })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async getApp() {
    try {
      console.log(await this.client.app.getApp({ id: APP_ID }));
    } catch (error) {
      console.log(error);
    }
  }

  public async getApps() {
    try {
      console.log(await this.client.app.getApps({}));
    } catch (error) {
      console.log(error);
    }
  }

  public async addApp() {
    try {
      console.log(
        await this.client.app.addApp({ name: "TEST_APP", space: SPACE_ID })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async getDeployStatus() {
    try {
      console.log(
        await this.client.app.getDeployStatus({
          apps: [APP_ID],
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async deployApp() {
    try {
      console.log(
        await this.client.app.deployApp({
          apps: [{ app: APP_ID }],
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async revertApp() {
    try {
      console.log(
        await this.client.app.deployApp({
          apps: [{ app: APP_ID }],
          revert: true,
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async getFieldAcl() {
    try {
      console.log(await this.client.app.getFieldAcl({ app: APP_ID }));
    } catch (error) {
      console.log(error);
    }
  }

  public async getFieldAclPreview() {
    try {
      console.log(
        await this.client.app.getFieldAcl({ app: APP_ID, preview: true })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async getRecordAcl() {
    try {
      console.log(await this.client.app.getFieldAcl({ app: APP_ID }));
    } catch (error) {
      console.log(error);
    }
  }

  public async updateRecordAcl() {
    const rights = [
      {
        filterCond: 'Customer = "foo"',
        entities: [
          {
            entity: {
              code: "everyone",
              type: "GROUP" as const,
            },
            viewable: true,
            editable: true,
            deletable: false,
            includeSubs: true,
          },
        ],
      },
    ];
    try {
      console.log(
        await this.client.app.updateRecordAcl({
          app: APP_ID,
          rights,
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async getAppAcl() {
    try {
      console.log(await this.client.app.getAppAcl({ app: APP_ID }));
    } catch (error) {
      console.log(error);
    }
  }

  public async updateAppAcl() {
    const rights = [
      {
        entity: {
          code: "Administrator",
          type: "USER" as const,
        },
        appEditable: true,
        recordViewable: true,
        recordAddable: true,
        recordEditable: true,
        recordDeletable: true,
        recordImportable: true,
        recordExportable: true,
      },
      {
        entity: {
          code: "everyone",
          type: "GROUP" as const,
        },
        appEditable: true,
        recordViewable: true,
      },
    ];
    try {
      console.log(await this.client.app.updateAppAcl({ app: APP_ID, rights }));
    } catch (error) {
      console.log(error);
    }
  }

  public async evaluateRecordsAcl() {
    const params = {
      app: APP_ID,
      ids: [RECORD_ID],
    };
    console.log(
      JSON.stringify(await this.client.app.evaluateRecordsAcl(params))
    );
  }

  public async updateFieldAcl() {
    const rights = [
      {
        code: "Customer",
        entities: [
          {
            accessibility: "WRITE" as const,
            entity: {
              code: "Administrator",
              type: "USER" as const,
            },
          },
          {
            accessibility: "READ" as const,
            entity: {
              code: "everyone",
              type: "GROUP" as const,
            },
          },
        ],
      },
    ];
    try {
      console.log(
        await this.client.app.updateFieldAcl({ app: APP_ID, rights })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async getAppCustomize() {
    try {
      console.log(
        JSON.stringify(await this.client.app.getAppCustomize({ app: APP_ID }))
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async updateAppCustomize() {
    const resource = {
      js: [
        {
          type: "URL" as const,
          url: "https://www.example.com/example.js",
        },
      ],
    };
    try {
      console.log(
        await this.client.app.updateAppCustomize({
          app: APP_ID,
          scope: "ALL",
          desktop: resource,
          mobile: resource,
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async updateAppCustomizeWithFile() {
    const { fileKey } = await this.client.file.uploadFile({
      file: { name: "Hello.js", data: "console.log('Hello');" },
    });

    const resource = {
      js: [
        {
          type: "FILE" as const,
          file: {
            fileKey,
          },
        },
      ],
    };
    try {
      console.log(
        await this.client.app.updateAppCustomize({
          app: APP_ID,
          scope: "ALL",
          desktop: resource,
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async getGeneralNotifications() {
    try {
      console.log(
        JSON.stringify(
          await this.client.app.getGeneralNotifications({ app: APP_ID })
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async updateGeneralNotifications() {
    const notifications = [
      {
        entity: {
          code: "Administrator",
          type: "USER" as const,
        },
        includeSubs: true,
        recordAdded: false,
        recordEdited: true,
        commentAdded: false,
        statusChanged: true,
        fileImported: false,
        notifyToCommenter: true,
      },
      {
        entity: {
          code: "everyone",
          type: "GROUP" as const,
        },
        includeSubs: false,
        recordAdded: true,
        recordEdited: false,
        commentAdded: true,
        statusChanged: false,
        fileImported: true,
        notifyToCommenter: false,
      },
    ];
    try {
      console.log(
        await this.client.app.updateGeneralNotifications({
          app: APP_ID,
          notifications,
          notifyToCommenter: true,
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async getPerRecordNotifications() {
    try {
      const res = await this.client.app.getPerRecordNotifications({
        app: APP_ID,
      });
      res.notifications.forEach((notification) => {
        console.log(`notification.title: ${notification.title}`);
        console.log(`notification.filterCond: ${notification.filterCond}`);
        console.log("targets:");
        notification.targets.forEach((target) => {
          console.log(
            `  target.entity: (${target.entity.code}: ${target.entity.type})`
          );
          console.log(`  target.includeSubs: ${target.includeSubs}`);
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  public async getPerRecordNotificationsPreview() {
    try {
      const res = await this.client.app.getPerRecordNotifications({
        app: APP_ID,
        preview: true,
      });
      res.notifications.forEach((notification) => {
        console.log(`notification.title: ${notification.title}`);
        console.log(`notification.filterCond: ${notification.filterCond}`);
        console.log("targets:");
        notification.targets.forEach((target) => {
          console.log(
            `  target.entity: (${target.entity.code}: ${target.entity.type})`
          );
          console.log(`  target.includeSubs: ${target.includeSubs}`);
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  public async updatePerRecordNotifications() {
    const notifications = [
      {
        filterCond: 'Customer = "foo"',
        title: "Send a notification",
        targets: [
          {
            entity: {
              code: "everyone",
              type: "GROUP" as const,
            },
            includeSubs: false,
          },
        ],
      },
    ];
    try {
      console.log(
        await this.client.app.updatePerRecordNotifications({
          app: APP_ID,
          notifications,
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async getReminderNotifications() {
    try {
      console.log(
        await this.client.app.getReminderNotifications({ app: APP_ID })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async getReminderNotificationsPreview() {
    try {
      console.log(
        await this.client.app.getReminderNotifications({
          app: APP_ID,
          preview: true,
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async updateReminderNotifications() {
    try {
      console.log(
        await this.client.app.updateReminderlNotifications({
          app: APP_ID,
          notifications: [
            {
              timing: {
                code: "作成日時",
                daysLater: "1",
                hoursLater: "2",
              },
              title: "This reminder was updated by rest-api-client-demo",
              targets: [
                {
                  entity: {
                    type: "USER",
                    code: "Administrator",
                  } as const,
                  includeSubs: false,
                },
              ],
            },
          ],
          timezone: "Asia/Tokyo",
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
}
