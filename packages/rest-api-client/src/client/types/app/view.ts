import { Appearance } from "./utilityType";

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

type ListView<T extends Appearance> = ViewBase<T> &
  (T extends "response"
    ? {
        type: "LIST";
        fields: string[];
      }
    : {
        type: "LIST";
        fields?: string[];
      });

type CalendarView<T extends Appearance> = ViewBase<T> &
  (T extends "response"
    ? {
        type: "CALENDAR";
        date: string;
        title: string;
      }
    : {
        type: "CALENDAR";
        date?: string;
        title?: string;
      });

type Device = "DESKTOP" | "ANY";

type CustomView<T extends Appearance> = ViewBase<T> &
  (T extends "response"
    ? {
        type: "CUSTOM";
        html: string;
        pager: boolean;
        device: Device;
      }
    : {
        type: "CUSTOM";
        html?: string;
        pager?: boolean;
        device?: Device;
      });

export type View<T extends Appearance> =
  | ListView<T>
  | CalendarView<T>
  | CustomView<T>;
