type ViewType = "LIST" | "CALENDAR" | "CUSTOM";

type ViewBaseForResponse = {
  index: string;
  builtinType?: "ASSIGNEE";
  id: string;
  name: string;
  filterCond: string;
  sort: string;
};

type ViewBaseForParameter = {
  index: string | number;
  name?: string;
  filterCond?: string;
  sort?: string;
};

type AdditionalPropertyForResponse = {
  LIST: { fields: string[] };
  CALENDAR: { date: string; title: string };
  CUSTOM: { html: string; pager: boolean; device: "DESKTOP" | "ANY" };
};

type AdditionalPropertyForParameter = {
  LIST: { fields?: string[] };
  CALENDAR: { date?: string; title?: string };
  CUSTOM: { html?: string; pager?: boolean; device?: "DESKTOP" | "ANY" };
};

export type ViewForResponse<U extends ViewType = ViewType> = U extends ViewType
  ? ViewBaseForResponse & { type: U } & AdditionalPropertyForResponse[U]
  : never;

export type ViewForParameter<U extends ViewType = ViewType> = U extends ViewType
  ? ViewBaseForParameter & { type: U } & AdditionalPropertyForParameter[U]
  : never;
