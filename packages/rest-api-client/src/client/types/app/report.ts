export type ReportForParameter = {};
export type ReportForResponse = {
  [graphName: string]: GraphProperty;
};

type ChartType =
  | "BAR"
  | "COLUMN"
  | "PIE"
  | "LINE"
  | "PIVOT_TABLE"
  | "TABLE"
  | "AREA"
  | "SPLINE"
  | "SPLINE_AREA";

type ChartMode = "NORMAL" | "STACKED" | "PERCENTAGE";

type PeriodicReportPeriodEvery =
  | "YEAR"
  | "QUARTER"
  | "MONTH"
  | "WEEK"
  | "DAY"
  | "HOUR"
  | "MINUTE";

type Aggregation = {
  type: "COUNT" | "SUM" | "AVERAGE" | "MAX" | "MIN";
  code: string;
};

type Sort = {
  by: "TOTAL" | "GROUP1" | "GROUP2" | "GROUP3";
  order: "ASC" | "DESC";
};

type QuarterPattern = "JAN_APR_JUL_OCT" | "FEB_MAY_AUG_NOV" | "MAR_JUN_SEP_DEC";

type DayOfWeek =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

type PeriodicReportForParameters = {
  active?: boolean | string;
  period?: {
    every: PeriodicReportPeriodEvery;
    month?: number | string;
    time?: string;
    pattern?: QuarterPattern;
    dayOfMonth?: string | "END_OF_MONTH";
    dayOfWeek?: DayOfWeek;
    minute?: string;
  };
};

type GraphProperty = {
  chartType: ChartType;
  chartMode?: ChartMode;
  name: string;
  index: string | number;
  groups?: Array<{
    code: string;
    per: PeriodicReportPeriodEvery;
  }>;
  aggregations?: Aggregation[];
  filterCond?: string;
  sorts?: Sort[];
  periodicReport?: PeriodicReportForParameters;
};
