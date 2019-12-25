import { AppID, RecordID, Revision } from "../KintoneTypes";
import { HttpClient } from "../http";

type Overwrite<T1, T2> = {
  [P in Exclude<keyof T1, keyof T2>]: T1[P];
} &
  T2;

type Lang = "ja" | "en" | "zh" | "user" | "default";

type Properties = {
  [fieldCode: string]: any;
};

type Layout = object[];

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

type ViewBase = {
  builtinType?: "ASSIGNEE";
  name: string;
  id: string;
  filterCond: string;
  sort: string;
  index: string;
};

type ListView = ViewBase & {
  type: "LIST";
  fields: string[];
};

type CalendarView = ViewBase & {
  type: "CALENDAR";
  date: string;
  title: string;
};

type CustomView = ViewBase & {
  type: "CUSTOM";
  html: string;
  pager: boolean;
  device: "DESKTOP" | "ANY";
};

type View = ListView | CalendarView | CustomView;

type ViewBaseForUpdate = {
  index: string | number;
  name?: string;
  filterCond?: string;
  sort?: string;
};

type ListViewForUpdate = ViewBaseForUpdate & {
  type: "LIST";
  fields?: string[];
};

type CalendarViewForUpdate = ViewBaseForUpdate & {
  type: "CALENDAR";
  date?: string;
  title?: string;
};

type CustomViewForUpdate = ViewBaseForUpdate & {
  type: "CUSTOM";
  html?: string;
  pager?: boolean;
  device?: "DESKTOP" | "ANY";
};

type ViewForUpdate =
  | ListViewForUpdate
  | CalendarViewForUpdate
  | CustomViewForUpdate;

type AssigneeEntity = {
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
    | {
        type: "CREATOR";
        code: null;
      };
  includeSubs: boolean;
};

type State = {
  name: string;
  index: string;
  assignee: {
    type: "ONE" | "ALL" | "ANY";
    entities: AssigneeEntity[];
  };
};

type AssigneeEntityForUpdate = {
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
    | {
        type: "CREATOR";
      };
  includeSubs?: boolean;
};

type StateForUpdate = {
  name?: string;
  index: string | number;
  assignee?: {
    type: "ONE" | "ALL" | "ANY";
    entities: AssigneeEntityForUpdate[];
  };
};

type Action = {
  name: string;
  from: string;
  to: string;
  filterCond: string;
};

type ActionForUpdate = Overwrite<Action, { filterCond?: string }>;

type DeployStatus = "PROCESSING" | "SUCCESS" | "FAIL" | "CANCEL";

type FieldRightEntity = {
  accessibility: "READ" | "WRITE" | "NONE";
  includeSubs: boolean;
  entity: {
    code: string;
    type: "USER" | "GROUP" | "ORGANIZATION" | "FIELD_ENTITY";
  };
};
type FieldRightEntityForUpdate = Overwrite<
  FieldRightEntity,
  { includeSubs?: boolean }
>;

type FieldRight = {
  code: string;
  entities: FieldRightEntity[];
};

type FieldRightForUpdate = Overwrite<
  FieldRight,
  { entities: FieldRightEntityForUpdate[] }
>;

type AppRightEntity = {
  entity:
    | {
        code: string;
        type: "USER" | "GROUP" | "ORGANIZATION";
      }
    | {
        type: "CREATOR";
        code: null;
      };
  includeSubs: boolean;
  appEditable: boolean;
  recordViewable: boolean;
  recordAddable: boolean;
  recordEditable: boolean;
  recordDeletable: boolean;
  recordImportable: boolean;
  recordExportable: boolean;
};

type AppRightEntityForUpdate = {
  entity:
    | {
        code: string;
        type: "USER" | "GROUP" | "ORGANIZATION";
      }
    | {
        type: "CREATOR";
      };
  includeSubs?: boolean;
  appEditable?: boolean;
  recordViewable?: boolean;
  recordAddable?: boolean;
  recordEditable?: boolean;
  recordDeletable?: boolean;
  recordImportable?: boolean;
  recordExportable?: boolean;
};

type RecordRightEntity = {
  entity: {
    code: string;
    type: "USER" | "GROUP" | "ORGANIZATION" | "FIELD_ENTITY";
  };
  viewable: boolean;
  editable: boolean;
  deletable: boolean;
  includeSubs: boolean;
};
type RecordRightEntityForUpdate = Overwrite<
  RecordRightEntity,
  {
    viewable?: boolean;
    editable?: boolean;
    deletable?: boolean;
    includeSubs?: boolean;
  }
>;

type RecordRight = {
  filterCond: string;
  entities: RecordRightEntity[];
};
type RecordRightForUpdate = {
  filterCond?: string;
  entities: RecordRightEntityForUpdate[];
};

type Rights = {
  id: string;
  record: {
    viewable: boolean;
    editable: boolean;
    deletable: boolean;
  };
  fields: object;
};

type CustomizeScope = "ALL" | "ADMIN" | "NONE";

type CustomizeResource =
  | {
      type: "URL";
      url: string;
    }
  | {
      type: "FILE";
      file: {
        name: string;
        fileKey: string;
        contentType: string;
        size: string;
      };
    };
type CustomizeResourceForUpdate =
  | {
      type: "URL";
      url: string;
    }
  | {
      type: "FILE";
      file: {
        fileKey: string;
      };
    };

type Customize = {
  js: CustomizeResource[];
  css: CustomizeResource[];
};
type CustomizeForUpdate = {
  js?: CustomizeResourceForUpdate[];
  css?: CustomizeResourceForUpdate[];
};

export class AppClient {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  public getFormFields<T extends Properties>(params: {
    app: AppID;
    lang?: Lang;
    preview?: boolean;
  }): Promise<{ properties: T; revision: string }> {
    const { preview, ...rest } = params;
    const path = `/k/v1${preview ? "/preview" : ""}/app/form/fields.json`;
    return this.client.get(path, { ...rest });
  }

  public addFormFields(params: {
    app: AppID;
    properties: object;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = "/k/v1/preview/app/form/fields.json";
    return this.client.post(path, params);
  }

  public updateFormFields(params: {
    app: AppID;
    properties: object;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = "/k/v1/preview/app/form/fields.json";
    return this.client.put(path, params);
  }

  public deleteFormFields(params: {
    app: AppID;
    fields: string[];
    revision?: Revision;
  }) {
    const path = "/k/v1/preview/app/form/fields.json";
    return this.client.delete(path, params);
  }

  public getFormLayout<T extends Layout>(params: {
    app: AppID;
    preview?: boolean;
  }): Promise<{ layout: T; revision: string }> {
    const { preview, ...rest } = params;
    const path = `/k/v1${preview ? "/preview" : ""}/app/form/layout.json`;
    return this.client.get(path, { ...rest });
  }

  public updateFormLayout(params: {
    app: AppID;
    layout: object[];
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = "/k/v1/preview/app/form/layout.json";
    return this.client.put(path, params);
  }

  public getViews(params: {
    app: AppID;
    lang?: Lang;
    preview?: boolean;
  }): Promise<{ views: { [viewName: string]: View }; revision: string }> {
    const { preview, ...rest } = params;
    const path = `/k/v1${preview ? "/preview" : ""}/app/views.json`;
    return this.client.get(path, rest);
  }

  public updateViews(params: {
    app: AppID;
    views: { [viewName: string]: ViewForUpdate };
    revision?: Revision;
  }): Promise<{
    views: { [viewName: string]: { id: string } };
    revision: string;
  }> {
    const path = `/k/v1/preview/app/views.json`;
    return this.client.put(path, params);
  }

  public getApp(params: { id: AppID }): Promise<App> {
    const path = "/k/v1/app.json";
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
    const path = "/k/v1/apps.json";
    return this.client.get(path, params);
  }

  public async addApp(params: {
    name: string;
    space?: string | number;
  }): Promise<{ app: string; revision: string }> {
    const { name, space } = params;
    const path = "/k/v1/preview/app.json";
    if (space) {
      const spacePath = "/k/v1/space.json";
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
      | { type: "PRESET"; key: "string" };
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
    const path = `/k/v1${preview ? "/preview" : ""}/app/settings.json`;
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
      | { type: "PRESET"; key: "string" };
    theme?: "WHITE" | "RED" | "BLUE" | "GREEN" | "YELLOW" | "BLACK";
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = `/k/v1/preview/app/settings.json`;
    return this.client.put(path, params);
  }

  public getProcessManagement(params: {
    app: AppID;
    lang?: Lang;
    preview?: boolean;
  }): Promise<{
    enable: boolean;
    states: {
      [statusName: string]: State;
    };
    actions: Action[];
    revision: string;
  }> {
    const { preview, ...rest } = params;
    const path = `/k/v1${preview ? "/preview" : ""}/app/status.json`;
    return this.client.get(path, rest);
  }

  public updateProcessManagement(params: {
    app: AppID;
    enable?: boolean;
    states?: { [statusName: string]: StateForUpdate };
    actions?: ActionForUpdate[];
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = "/k/v1/preview/app/status.json";
    return this.client.put(path, params);
  }

  public getDeployStatus(params: {
    apps: AppID[];
  }): Promise<{ apps: Array<{ app: string; status: DeployStatus }> }> {
    const path = "/k/v1/preview/app/deploy.json";
    return this.client.get(path, params);
  }

  public deployApp(params: {
    apps: Array<{ app: AppID; revision?: Revision }>;
    revert?: boolean;
  }): Promise<{}> {
    const path = "/k/v1/preview/app/deploy.json";
    return this.client.post(path, params);
  }

  public getFieldAcl(params: {
    app: AppID;
    preview?: boolean;
  }): Promise<{ rights: FieldRight[]; revision: string }> {
    const { preview, ...rest } = params;
    const path = `/k/v1${preview ? "/preview" : ""}/field/acl.json`;
    return this.client.get(path, { ...rest });
  }

  public updateRecordAcl(params: {
    app: AppID;
    rights: RecordRightForUpdate[];
    revision?: Revision;
  }): Promise<{ revision: string }> {
    // NOTE: When executing this API without `preview`,
    // all pre-live app's settings will be deployed to live app.
    // This behavior may not be what the users expected,
    // so we disable it temporarily.
    const path = "/k/v1/preview/record/acl.json";
    return this.client.put(path, params);
  }

  public getAppAcl(params: {
    app: AppID;
    preview?: boolean;
  }): Promise<{ rights: AppRightEntity[]; revision: string }> {
    const { preview, ...rest } = params;
    const path = `/k/v1${preview ? "/preview" : ""}/app/acl.json`;
    return this.client.get(path, { ...rest });
  }

  public updateAppAcl(params: {
    app: AppID;
    rights: AppRightEntityForUpdate[];
    revision?: Revision;
  }): Promise<{ revision: string }> {
    // NOTE: When executing this API without `preview`,
    // all pre-live app's settings will be deployed to live app.
    // This behavior may not be what the users expected,
    // so we disable it temporarily.
    const path = "/k/v1/preview/app/acl.json";
    return this.client.put(path, params);
  }

  public evaluateRecordsAcl(params: {
    app: AppID;
    ids: RecordID[];
  }): Promise<{ rights: Rights }> {
    const path = "/k/v1/records/acl/evaluate.json";
    return this.client.get(path, params);
  }

  public updateFieldAcl(params: {
    app: AppID;
    rights: FieldRightForUpdate[];
    revision?: Revision;
  }): Promise<{ revision: string }> {
    // NOTE: When executing this API without `preview`,
    // all pre-live app's settings will be deployed to live app.
    // This behavior may not be what the users expected,
    // so we disable it temporarily.
    const path = "/k/v1/preview/field/acl.json";
    return this.client.put(path, params);
  }

  public getRecordAcl(params: {
    app: AppID;
    lang?: Lang;
    preview?: boolean;
  }): Promise<{ rights: RecordRight[]; revision: string }> {
    const { preview, ...rest } = params;
    const path = `/k/v1${preview ? "/preview" : ""}/record/acl.json`;
    return this.client.get(path, { ...rest });
  }

  public getCustomize(params: {
    app: AppID;
    preview?: boolean;
  }): Promise<{
    scope: CustomizeScope;
    desktop: Customize;
    mobile: Customize;
    revision: string;
  }> {
    const { preview, ...rest } = params;
    const path = `/k/v1${preview ? "/preview" : ""}/app/customize.json`;
    return this.client.get(path, { ...rest });
  }

  public updateCustomize(params: {
    app: AppID;
    scope?: CustomizeScope;
    desktop?: CustomizeForUpdate;
    mobile?: CustomizeForUpdate;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = "/k/v1/preview/app/customize.json";
    return this.client.put(path, params);
  }
}
