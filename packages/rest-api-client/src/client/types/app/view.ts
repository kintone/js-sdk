import { Appearance, ConditionalStrict, ConditionalExist } from "./utilityType";

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
