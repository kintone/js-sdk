import { HttpClient } from "../http";
import { buildPath } from "../url";
import {
  AppID,
  RecordID,
  Revision,
  Properties,
  Lang,
  Layout,
  ViewForResponse,
  ViewForParameter,
  App,
  StateForResponse,
  StateForParameter,
  ActionForResponse,
  ActionForParameter,
  DeployStatus,
  FieldRightForResponse,
  FieldRightForParameter,
  AppRightEntityForResponse,
  AppRightEntityForParameter,
  EvaluatedRecordRight,
  RecordRightForResponse,
  RecordRightForParameter,
  AppCustomizeScope,
  AppCustomizeForResponse,
  AppCustomizeForParameter,
  GeneralNotificationForParameter,
  GeneralNotificationForResponse,
  PerRecordNotificationForParameter,
  PerRecordNotificationForResponse,
  ReminderNotificationForParameter,
  ReminderNotificationForResponse,
  ReportForParameter,
  ReportForResponse,
  AppActionsForParameter,
  AppActionsForResponse,
} from "./types";
type RowLayoutForParameter = {
  type: "ROW";
  fields: Array<{ [key: string]: unknown }>;
};
type SubtableLayoutForParameter = {
  type: "SUBTABLE";
  code: string;
  fields: Array<{ [key: string]: unknown }>;
};
type GroupLayoutForParameter = {
  type: "GROUP";
  code: string;
  layout: RowLayoutForParameter[];
};
type LayoutForParameter = Array<
  RowLayoutForParameter | SubtableLayoutForParameter | GroupLayoutForParameter
>;
type NestedPartial<T> = T extends object
  ? {
      [K in keyof T]?: NestedPartial<T[K]>;
    }
  : T;

type PropertiesForParameter = NestedPartial<Properties>;

export class AppClient {
  private client: HttpClient;
  private guestSpaceId?: number | string;

  constructor(client: HttpClient, guestSpaceId?: number | string) {
    this.client = client;
    this.guestSpaceId = guestSpaceId;
  }

  public getFormFields<T extends Properties>(params: {
    app: AppID;
    lang?: Lang;
    preview?: boolean;
  }): Promise<{ properties: T; revision: string }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/form/fields",
      preview,
    });
    return this.client.get(path, { ...rest });
  }

  public addFormFields(params: {
    app: AppID;
    properties: PropertiesForParameter;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/form/fields",
      preview: true,
    });
    return this.client.post(path, params);
  }

  public updateFormFields(params: {
    app: AppID;
    properties: PropertiesForParameter;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/form/fields",
      preview: true,
    });
    return this.client.put(path, params);
  }

  public deleteFormFields(params: {
    app: AppID;
    fields: string[];
    revision?: Revision;
  }) {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/form/fields",
      preview: true,
    });
    return this.client.delete(path, params);
  }

  public getFormLayout<T extends Layout>(params: {
    app: AppID;
    preview?: boolean;
  }): Promise<{ layout: T; revision: string }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/form/layout",
      preview,
    });
    return this.client.get(path, { ...rest });
  }

  public updateFormLayout(params: {
    app: AppID;
    layout: LayoutForParameter;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/form/layout",
      preview: true,
    });
    return this.client.put(path, params);
  }

  public getViews(params: {
    app: AppID;
    lang?: Lang;
    preview?: boolean;
  }): Promise<{
    views: { [viewName: string]: ViewForResponse };
    revision: string;
  }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/views",
      preview,
    });
    return this.client.get(path, rest);
  }

  public updateViews(params: {
    app: AppID;
    views: { [viewName: string]: ViewForParameter };
    revision?: Revision;
  }): Promise<{
    views: { [viewName: string]: { id: string } };
    revision: string;
  }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/views",
      preview: true,
    });
    return this.client.put(path, params);
  }

  public getApp(params: { id: AppID }): Promise<App> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app",
    });
    return this.client.get(path, params);
  }

  public getApps(params: {
    ids?: AppID[] | null;
    codes?: string[] | null;
    name?: string | null;
    spaceIds?: Array<string | number> | null;
    limit?: string | number;
    offset?: string | number;
  }): Promise<{ apps: App[] }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "apps",
    });
    return this.client.get(path, params);
  }

  public async addApp(params: {
    name: string;
    space?: string | number;
  }): Promise<{ app: string; revision: string }> {
    const { name, space } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app",
      preview: true,
    });
    if (space) {
      // NOTE: Although `thread` parameter is required in REST API,
      // there are no visual representations of apps being related to threads.
      // Moreover, there is currently no helpful reason to create apps in threads other than the default thread,
      // so the API Client sets the default thread id here.
      const spacePath = this.buildPathWithGuestSpaceId({
        endpointName: "space",
      });
      const { defaultThread } = await this.client.get(spacePath, {
        id: space,
      });
      return this.client.post(path, { ...params, thread: defaultThread });
    }
    return this.client.post(path, { name });
  }

  public getAppSettings(params: {
    app: AppID;
    lang?: Lang;
    preview?: boolean;
  }): Promise<{
    name: string;
    description: string;
    icon:
      | {
          type: "FILE";
          file: {
            contentType: string;
            fileKey: string;
            name: string;
            size: string;
          };
        }
      | { type: "PRESET"; key: string };
    theme:
      | "WHITE"
      | "CLIPBOARD"
      | "BINDER"
      | "PENCIL"
      | "CLIPS"
      | "RED"
      | "BLUE"
      | "GREEN"
      | "YELLOW"
      | "BLACK";
    revision: string;
  }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/settings",
      preview,
    });
    return this.client.get(path, rest);
  }

  public updateAppSettings(params: {
    app: AppID;
    name?: string;
    description?: string;
    icon?:
      | {
          type: "FILE";
          file: {
            fileKey: string;
          };
        }
      | { type: "PRESET"; key: string };
    theme?:
      | "WHITE"
      | "CLIPBOARD"
      | "BINDER"
      | "PENCIL"
      | "CLIPS"
      | "RED"
      | "BLUE"
      | "GREEN"
      | "YELLOW"
      | "BLACK";
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/settings",
      preview: true,
    });
    return this.client.put(path, params);
  }

  public getProcessManagement(params: {
    app: AppID;
    lang?: Lang;
    preview?: boolean;
  }): Promise<{
    enable: boolean;
    states: {
      [statusName: string]: StateForResponse;
    };
    actions: ActionForResponse[];
    revision: string;
  }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/status",
      preview,
    });
    return this.client.get(path, rest);
  }

  public updateProcessManagement(params: {
    app: AppID;
    enable?: boolean;
    states?: { [statusName: string]: StateForParameter };
    actions?: ActionForParameter[];
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/status",
      preview: true,
    });
    return this.client.put(path, params);
  }

  public getDeployStatus(params: {
    apps: AppID[];
  }): Promise<{ apps: Array<{ app: string; status: DeployStatus }> }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/deploy",
      preview: true,
    });
    return this.client.get(path, params);
  }

  public deployApp(params: {
    apps: Array<{ app: AppID; revision?: Revision }>;
    revert?: boolean;
  }): Promise<{}> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/deploy",
      preview: true,
    });
    return this.client.post(path, params);
  }

  public getFieldAcl(params: {
    app: AppID;
    preview?: boolean;
  }): Promise<{ rights: FieldRightForResponse[]; revision: string }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "field/acl",
      preview,
    });
    return this.client.get(path, { ...rest });
  }

  public updateFieldAcl(params: {
    app: AppID;
    rights: FieldRightForParameter[];
    revision?: Revision;
  }): Promise<{ revision: string }> {
    // NOTE: When executing this API without `preview`,
    // all pre-live app's settings will be deployed to live app.
    // This behavior may not be what the users expected,
    // so we disable it temporarily.
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "field/acl",
      preview: true,
    });
    return this.client.put(path, params);
  }

  public getAppAcl(params: {
    app: AppID;
    preview?: boolean;
  }): Promise<{ rights: AppRightEntityForResponse[]; revision: string }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/acl",
      preview,
    });
    return this.client.get(path, { ...rest });
  }

  public updateAppAcl(params: {
    app: AppID;
    rights: AppRightEntityForParameter[];
    revision?: Revision;
  }): Promise<{ revision: string }> {
    // NOTE: When executing this API without `preview`,
    // all pre-live app's settings will be deployed to live app.
    // This behavior may not be what the users expected,
    // so we disable it temporarily.
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/acl",
      preview: true,
    });
    return this.client.put(path, params);
  }

  public evaluateRecordsAcl(params: {
    app: AppID;
    ids: RecordID[];
  }): Promise<{ rights: EvaluatedRecordRight[] }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "records/acl/evaluate",
    });
    return this.client.get(path, params);
  }

  public getRecordAcl(params: {
    app: AppID;
    lang?: Lang;
    preview?: boolean;
  }): Promise<{ rights: RecordRightForResponse[]; revision: string }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record/acl",
      preview,
    });
    return this.client.get(path, { ...rest });
  }

  public updateRecordAcl(params: {
    app: AppID;
    rights: RecordRightForParameter[];
    revision?: Revision;
  }): Promise<{ revision: string }> {
    // NOTE: When executing this API without `preview`,
    // all pre-live app's settings will be deployed to live app.
    // This behavior may not be what the users expected,
    // so we disable it temporarily.
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record/acl",
      preview: true,
    });
    return this.client.put(path, params);
  }

  public getAppCustomize(params: { app: AppID; preview?: boolean }): Promise<{
    scope: AppCustomizeScope;
    desktop: AppCustomizeForResponse;
    mobile: AppCustomizeForResponse;
    revision: string;
  }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/customize",
      preview,
    });
    return this.client.get(path, { ...rest });
  }

  public updateAppCustomize(params: {
    app: AppID;
    scope?: AppCustomizeScope;
    desktop?: AppCustomizeForParameter;
    mobile?: AppCustomizeForParameter;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/customize",
      preview: true,
    });
    return this.client.put(path, params);
  }

  public getGeneralNotifications(params: {
    app: AppID;
    preview?: boolean;
  }): Promise<{
    notifications: GeneralNotificationForResponse[];
    notifyToCommenter: boolean;
    revision: string;
  }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/notifications/general",
      preview,
    });
    return this.client.get(path, { ...rest });
  }

  public updateGeneralNotifications(params: {
    app: AppID;
    notifications?: GeneralNotificationForParameter[];
    notifyToCommenter?: boolean;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/notifications/general",
      preview: true,
    });
    return this.client.put(path, params);
  }

  public getPerRecordNotifications(params: {
    app: AppID;
    lang?: Lang;
    preview?: boolean;
  }): Promise<{
    notifications: PerRecordNotificationForResponse[];
    revision: string;
  }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/notifications/perRecord",
      preview,
    });
    return this.client.get(path, rest);
  }

  public updatePerRecordNotifications(params: {
    app: AppID;
    notifications: PerRecordNotificationForParameter[];
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/notifications/perRecord",
      preview: true,
    });
    return this.client.put(path, params);
  }

  public getReminderNotifications(params: {
    app: AppID;
    lang?: Lang;
    preview?: boolean;
  }): Promise<{
    notifications: ReminderNotificationForResponse[];
    timezone: string;
    revision: string;
  }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/notifications/reminder",
      preview,
    });
    return this.client.get(path, rest);
  }

  public updateReminderNotifications(params: {
    app: AppID;
    notifications?: ReminderNotificationForParameter[];
    timezone?: string;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/notifications/reminder",
      preview: true,
    });
    return this.client.put(path, params);
  }

  public getReports(params: {
    app: AppID;
    lang?: Lang;
    preview?: boolean;
  }): Promise<{
    reports: { [reportName: string]: ReportForResponse };
    revision: string;
  }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/reports",
      preview,
    });
    return this.client.get(path, rest);
  }

  public updateReports(params: {
    app: AppID;
    reports: ReportForParameter;
    revision?: Revision;
  }): Promise<{
    revision: string;
    reports: { [reportName: string]: { id: string } };
  }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/reports",
      preview: true,
    });
    return this.client.put(path, params);
  }

  public getAppActions(params: {
    app: AppID;
    lang?: Lang;
    preview?: boolean;
  }): Promise<{
    actions: AppActionsForResponse;
    revision: string;
  }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/actions",
      preview,
    });
    return this.client.get(path, rest);
  }

  public updateAppActions(params: {
    app: AppID;
    actions: AppActionsForParameter;
    revision?: Revision;
  }): Promise<{
    revision: string;
    actions: { [actionName: string]: { id: string } };
  }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/actions",
      preview: true,
    });
    return this.client.put(path, params);
  }

  private buildPathWithGuestSpaceId(params: {
    endpointName: string;
    preview?: boolean;
  }) {
    return buildPath({
      ...params,
      guestSpaceId: this.guestSpaceId,
    });
  }
}
