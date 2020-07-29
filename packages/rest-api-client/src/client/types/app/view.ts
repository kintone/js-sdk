import { Appearance } from "./apperance";

type ViewType = "LIST" | "CALENDAR" | "CUSTOM";

type ViewBase<T extends Appearance> = T extends "response"
  ? {
      index: string;
      builtinType?: "ASSIGNEE";
      id: string;
      name: string;
      filterCond: string;
      sort: string;
    }
  : {
      index: string | number;
      name?: string;
      filterCond?: string;
      sort?: string;
    };

type AdditionalProperty<T extends Appearance> = T extends "response"
  ? {
      LIST: { fields: string[] };
      CALENDAR: { date: string; title: string };
      CUSTOM: { html: string; pager: boolean; device: "DESKTOP" | "ANY" };
    }
  : {
      LIST: { fields?: string[] };
      CALENDAR: { date?: string; title?: string };
      CUSTOM: { html?: string; pager?: boolean; device?: "DESKTOP" | "ANY" };
    };

export type View<
  T extends Appearance,
  U extends ViewType = ViewType
> = U extends ViewType
  ? ViewBase<T> & { type: U } & AdditionalProperty<T>[U]
  : never;
