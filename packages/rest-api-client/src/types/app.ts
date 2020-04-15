type ConditionalStrict<T, U, V extends object> = T extends U ? V : Partial<V>;
type ConditionalExist<T, U, V extends object> = T extends U ? V : {};

type Appearance = "response" | "parameter";

export type Lang = "ja" | "en" | "zh" | "user" | "default";

// TODO: Make this type more specific
export type Properties = {
  [fieldCode: string]: {
    [k: string]: any;
  };
};

// TODO: Make this type more specific
export type Layout = Array<{
  [k: string]: any;
}>;

export type App = {
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

export type View<T extends Appearance> =
  | ListView<T>
  | CalendarView<T>
  | CustomView<T>;

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

export type State<T extends Appearance> = {
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

export type Action<T extends Appearance> = {
  name: string;
  from: string;
  to: string;
} & ConditionalStrict<T, "response", { filterCond: string }>;

export type DeployStatus = "PROCESSING" | "SUCCESS" | "FAIL" | "CANCEL";

type FieldRightEntity<T extends Appearance> = {
  accessibility: "READ" | "WRITE" | "NONE";
  entity: {
    code: string;
    type: "USER" | "GROUP" | "ORGANIZATION" | "FIELD_ENTITY";
  };
} & ConditionalStrict<T, "response", { includeSubs: boolean }>;

export type FieldRight<T extends Appearance> = {
  code: string;
  entities: Array<FieldRightEntity<T>>;
};

export type AppRightEntity<T extends Appearance> = {
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

export type RecordRight<T extends Appearance> = {
  entities: Array<RecordRightEntity<T>>;
} & ConditionalStrict<T, "response", { filterCond: string }>;

export type EvaluatedRecordRight = {
  id: string;
  record: {
    viewable: boolean;
    editable: boolean;
    deletable: boolean;
  };
  fields: {
    [fieldCode: string]: {
      viewable: boolean;
      editable: boolean;
    };
  };
};

export type AppCustomizeScope = "ALL" | "ADMIN" | "NONE";

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

export type AppCustomize<T extends Appearance> = ConditionalStrict<
  T,
  "response",
  {
    js: Array<AppCustomizeResource<T>>;
    css: Array<AppCustomizeResource<T>>;
  }
>;
