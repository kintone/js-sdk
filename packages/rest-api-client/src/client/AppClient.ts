import { AppID, RecordID, Revision } from "../KintoneTypes";
import { HttpClient } from "../http";
import { buildPath } from "../url";

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

type AppCustomizeScope = "ALL" | "ADMIN" | "NONE";

type AppCustomizeResource =
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
type AppCustomizeResourceForUpdate =
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

type AppCustomize = {
  js: AppCustomizeResource[];
  css: AppCustomizeResource[];
};
type AppCustomizeForUpdate = {
  js?: AppCustomizeResourceForUpdate[];
  css?: AppCustomizeResourceForUpdate[];
};

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
  }): Promise<{ views: { [viewName: string]: View }; revision: string }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/views",
      preview
    });
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
      | { type: "PRESET"; key: "string" };
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
      [statusName: string]: State;
    };
    actions: Action[];
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
    states?: { [statusName: string]: StateForUpdate };
    actions?: ActionForUpdate[];
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
  }): Promise<{ rights: FieldRight[]; revision: string }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "field/acl",
      preview
    });
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
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record/acl",
      preview: true
    });
    return this.client.put(path, params);
  }

  public getAppAcl(params: {
    app: AppID;
    preview?: boolean;
  }): Promise<{ rights: AppRightEntity[]; revision: string }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "app/acl",
      preview
    });
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

  public updateFieldAcl(params: {
    app: AppID;
    rights: FieldRightForUpdate[];
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

  public getRecordAcl(params: {
    app: AppID;
    lang?: Lang;
    preview?: boolean;
  }): Promise<{ rights: RecordRight[]; revision: string }> {
    const { preview, ...rest } = params;
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record/acl",
      preview
    });
    return this.client.get(path, { ...rest });
  }

  public getAppCustomize(params: {
    app: AppID;
    preview?: boolean;
  }): Promise<{
    scope: AppCustomizeScope;
    desktop: AppCustomize;
    mobile: AppCustomize;
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
    desktop?: AppCustomizeForUpdate;
    mobile?: AppCustomizeForUpdate;
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
