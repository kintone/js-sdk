export type ReportForParameter = {};
export type ReportForResponse = {
  [graphName: string]: GraphProperty;
};

type Period = "YEAR" | "QUARTER" | "MONTH" | "WEEK" | "DAY" | "HOUR" | "MINUTE";
type Aggregation = {
  type: "COUNT" | "SUM" | "AVERAGE" | "MAX" | "MIN";
  code: string;
};
type Sort = {
  by: "TOTAL" | "GROUP1" | "GROUP2" | "GROUP3";
  order: "ASC" | "DESC";
};
type PeriodicReport = {
  active?: boolean | string;
  period?: {
    every: Period;
    month?: number | string;
    time?: string;
    pattern?: "JAN_APR_JUL_OCT" | "FEB_MAY_AUG_NOV" | "MAR_JUN_SEP_DEC";
    dayOfMonth?: string | "END_OF_MONTH";
    dayOfWeek?:
      | "SUNDAY"
      | "MONDAY"
      | "TUESDAY"
      | "WEDNESDAY"
      | "THURSDAY"
      | "FRIDAY"
      | "SATURDAY";
    minute?: string;
  };
};
type GraphProperty = {
  chartType:
    | "BAR"
    | "COLUMN"
    | "PIE"
    | "LINE"
    | "PIVOT_TABLE"
    | "TABLE"
    | "AREA"
    | "SPLINE"
    | "SPLINE_AREA";
  chartMode?: "NORMAL" | "STACKED" | "PERCENTAGE";
  name: string;
  index: string | number;
  groups?: Array<{
    code: string;
    per: Period;
  }>;
  aggregations?: Aggregation[];
  filterCond?: string;
  sorts?: Sort[];
  periodicReport?: PeriodicReport;
};
