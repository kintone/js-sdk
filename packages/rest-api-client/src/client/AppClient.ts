import { AppID, RecordID, Revision } from "../KintoneTypes";
import { HttpClient } from "../http";
import { buildPath } from "../url";

type ConditionalStrict<T, U, V extends object> = T extends U ? V : Partial<V>;
type ConditionalExist<T, U, V extends object> = T extends U ? V : {};

type Appearance = "response" | "parameter";

type Lang = "ja" | "en" | "zh" | "user" | "default";

// TODO: Make this type more specific
type Properties = {
  [fieldCode: string]: {
    [k: string]: any;
  };
};

// TODO: Make this type more specific
type Layout = Array<{
  [k: string]: any;
}>;

type App = {
  appId: string;
  code: string;
  name: string;
  description: string;
  spaceId: string | null;
  threadId: string | null;
  createdAt: string;
  creator: { code: string; name: string };
  modifiedAt: string;
  modifier: {
    code: string;
    name: string;
  };
};

type ViewBase<T extends Appearance> = {
  index: T extends "response"
    ? string
    : T extends "parameter"
    ? string | number
    : never;
} & ConditionalExist<T, "response", { builtinType?: "ASSIGNEE"; id: string }> &
  ConditionalStrict<
    T,
    "response",
    { name: string; filterCond: string; sort: string }
  >;

type ListView<T extends Appearance> = ViewBase<T> & {
  type: "LIST";
} & ConditionalStrict<
    T,
    "response",
    {
      fields: string[];
    }
  >;

type CalendarView<T extends Appearance> = ViewBase<T> & {
  type: "CALENDAR";
} & ConditionalStrict<
    T,
    "response",
    {
      date: string;
      title: string;
    }
  >;

type CustomView<T extends Appearance> = ViewBase<T> & {
  type: "CUSTOM";
} & ConditionalStrict<
    T,
    "response",
    {
      html: string;
      pager: boolean;
      device: "DESKTOP" | "ANY";
    }
  >;

type View<T extends Appearance> = ListView<T> | CalendarView<T> | CustomView<T>;

type AssigneeEntity<T extends Appearance> = {
  entity:
    | {
        type:
          | "USER"
          | "GROUP"
          | "ORGANIZATION"
          | "FIELD_ENTITY"
          | "CUSTOM_FIELD";
        code: string;
      }
    | ({
        type: "CREATOR";
      } & ConditionalExist<T, "response", { code: null }>);
} & ConditionalStrict<T, "response", { includeSubs: boolean }>;

type State<T extends Appearance> = {
  index: T extends "response"
    ? string
    : T extends "parameter"
    ? string | number
    : never;
} & ConditionalStrict<
  T,
  "response",
  {
    name: string;
    assignee: {
      type: "ONE" | "ALL" | "ANY";
      entities: Array<AssigneeEntity<T>>;
    };
  }
>;

type Action<T extends Appearance> = {
  name: string;
  from: string;
  to: string;
} & ConditionalStrict<T, "response", { filterCond: string }>;

type DeployStatus = "PROCESSING" | "SUCCESS" | "FAIL" | "CANCEL";

type FieldRightEntity<T extends Appearance> = {
  accessibility: "READ" | "WRITE" | "NONE";
  entity: {
    code: string;
    type: "USER" | "GROUP" | "ORGANIZATION" | "FIELD_ENTITY";
  };
} & ConditionalStrict<T, "response", { includeSubs: boolean }>;

type FieldRight<T extends Appearance> = {
  code: string;
  entities: Array<FieldRightEntity<T>>;
};

type AppRightEntity<T extends Appearance> = {
  entity:
    | {
        code: string;
        type: "USER" | "GROUP" | "ORGANIZATION";
      }
    | ({
        type: "CREATOR";
      } & ConditionalExist<T, "response", { code: null }>);
} & ConditionalStrict<
  T,
  "response",
  {
    includeSubs: boolean;
    appEditable: boolean;
    recordViewable: boolean;
    recordAddable: boolean;
    recordEditable: boolean;
    recordDeletable: boolean;
    recordImportable: boolean;
    recordExportable: boolean;
  }
>;

type RecordRightEntity<T extends Appearance> = {
  entity: {
    code: string;
    type: "USER" | "GROUP" | "ORGANIZATION" | "FIELD_ENTITY";
  };
} & ConditionalStrict<
  T,
  "response",
  {
    viewable: boolean;
    editable: boolean;
    deletable: boolean;
    includeSubs: boolean;
  }
>;

type RecordRight<T extends Appearance> = {
  entities: Array<RecordRightEntity<T>>;
} & ConditionalStrict<T, "response", { filterCond: string }>;

type Rights = {
  id: string;
  record: {
    viewable: boolean;
    editable: boolean;
    deletable: boolean;
  };
  fields: object;
};

type AppCustomizeScope = "ALL" | "ADMIN" | "NONE";

type AppCustomizeResource<T extends Appearance> =
  | {
      type: "URL";
      url: string;
    }
  | {
      type: "FILE";
      file: {
        fileKey: string;
      } & ConditionalExist<
        T,
        "response",
        { name: string; contentType: string; size: string }
      >;
    };

type AppCustomize<T extends Appearance> = ConditionalStrict<
  T,
  "response",
  {
    js: Array<AppCustomizeResource<T>>;
    css: Array<AppCustomizeResource<T>>;
  }
>;

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
      preview
    });
    return this.client.get(path, { ...rest });
  }

  public addFormFields(params: {
    app: AppID;
    properties: object;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/form/fields",
      preview: true
    });
    return this.client.post(path, params);
  }

  public updateFormFields(params: {
    app: AppID;
    properties: object;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/form/fields",
      preview: true
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
      preview: true
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
      preview
    });
    return this.client.get(path, { ...rest });
  }

  public updateFormLayout(params: {
    app: AppID;
    layout: object[];
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/form/layout",
      preview: true
    });
    return this.client.put(path, params);
  }

  public getViews(params: {
    app: AppID;
    lang?: Lang;
    preview?: boolean;
  }): Promise<{
    views: { [viewName: string]: View<"response"> };
    revision: string;
  }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/views",
      preview
    });
    return this.client.get(path, rest);
  }

  public updateViews(params: {
    app: AppID;
    views: { [viewName: string]: View<"parameter"> };
    revision?: Revision;
  }): Promise<{
    views: { [viewName: string]: { id: string } };
    revision: string;
  }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/views",
      preview: true
    });
    return this.client.put(path, params);
  }

  public getApp(params: { id: AppID }): Promise<App> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app"
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
      endpointName: "apps"
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
      preview: true
    });
    if (space) {
      // NOTE: Although `thread` parameter is required in REST API,
      // there are no visual representations of apps being related to threads.
      // Moreover, there is currently no helpful reason to create apps in threads other than the default thread,
      // so the API Client sets the default thread id here.
      const spacePath = this.buildPathWithGuestSpaceId({
        endpointName: "space"
      });
      const { defaultThread } = await this.client.get(spacePath, {
        id: space
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
      preview
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
      preview: true
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
      [statusName: string]: State<"response">;
    };
    actions: Array<Action<"response">>;
    revision: string;
  }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/status",
      preview
    });
    return this.client.get(path, rest);
  }

  public updateProcessManagement(params: {
    app: AppID;
    enable?: boolean;
    states?: { [statusName: string]: State<"parameter"> };
    actions?: Array<Action<"parameter">>;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/status",
      preview: true
    });
    return this.client.put(path, params);
  }

  public getDeployStatus(params: {
    apps: AppID[];
  }): Promise<{ apps: Array<{ app: string; status: DeployStatus }> }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/deploy",
      preview: true
    });
    return this.client.get(path, params);
  }

  public deployApp(params: {
    apps: Array<{ app: AppID; revision?: Revision }>;
    revert?: boolean;
  }): Promise<{}> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/deploy",
      preview: true
    });
    return this.client.post(path, params);
  }

  public getFieldAcl(params: {
    app: AppID;
    preview?: boolean;
  }): Promise<{ rights: Array<FieldRight<"response">>; revision: string }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "field/acl",
      preview
    });
    return this.client.get(path, { ...rest });
  }

  public updateFieldAcl(params: {
    app: AppID;
    rights: Array<FieldRight<"parameter">>;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    // NOTE: When executing this API without `preview`,
    // all pre-live app's settings will be deployed to live app.
    // This behavior may not be what the users expected,
    // so we disable it temporarily.
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "field/acl",
      preview: true
    });
    return this.client.put(path, params);
  }

  public getAppAcl(params: {
    app: AppID;
    preview?: boolean;
  }): Promise<{ rights: Array<AppRightEntity<"response">>; revision: string }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/acl",
      preview
    });
    return this.client.get(path, { ...rest });
  }

  public updateAppAcl(params: {
    app: AppID;
    rights: Array<AppRightEntity<"parameter">>;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    // NOTE: When executing this API without `preview`,
    // all pre-live app's settings will be deployed to live app.
    // This behavior may not be what the users expected,
    // so we disable it temporarily.
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/acl",
      preview: true
    });
    return this.client.put(path, params);
  }

  public evaluateRecordsAcl(params: {
    app: AppID;
    ids: RecordID[];
  }): Promise<{ rights: Rights }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "records/acl/evaluate"
    });
    return this.client.get(path, params);
  }

  public getRecordAcl(params: {
    app: AppID;
    lang?: Lang;
    preview?: boolean;
  }): Promise<{ rights: Array<RecordRight<"response">>; revision: string }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record/acl",
      preview
    });
    return this.client.get(path, { ...rest });
  }

  public updateRecordAcl(params: {
    app: AppID;
    rights: Array<RecordRight<"parameter">>;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    // NOTE: When executing this API without `preview`,
    // all pre-live app's settings will be deployed to live app.
    // This behavior may not be what the users expected,
    // so we disable it temporarily.
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record/acl",
      preview: true
    });
    return this.client.put(path, params);
  }

  public getAppCustomize(params: {
    app: AppID;
    preview?: boolean;
  }): Promise<{
    scope: AppCustomizeScope;
    desktop: AppCustomize<"response">;
    mobile: AppCustomize<"response">;
    revision: string;
  }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/customize",
      preview
    });
    return this.client.get(path, { ...rest });
  }

  public updateAppCustomize(params: {
    app: AppID;
    scope?: AppCustomizeScope;
    desktop?: AppCustomize<"parameter">;
    mobile?: AppCustomize<"parameter">;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/customize",
      preview: true
    });
    return this.client.put(path, params);
  }

  private buildPathWithGuestSpaceId(params: {
    endpointName: string;
    preview?: boolean;
  }) {
    return buildPath({
      ...params,
      guestSpaceId: this.guestSpaceId
    });
  }
}
