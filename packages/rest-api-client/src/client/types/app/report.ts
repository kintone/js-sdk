// --- Types for request ---

export type ReportForParameter = {
  [reportName: string]: ReportProperty;
};

type ChartTypeWithRequiredMode = "BAR" | "COLUMN" | "AREA" | "SPLINE_AREA";

type ChartTypeWithOptionalMode =
  | "PIE"
  | "LINE"
  | "PIVOT_TABLE"
  | "TABLE"
  | "SPLINE";

type ChartProps = {
  name: string;
  index: string | number;
  groups?: Array<{
    code: string;
    per?: GroupPer;
  }>;
  aggregations?: Aggregation[];
  filterCond?: string;
  sorts?: Sort[];
  periodicReport?: PeriodicReportForParameters;
};

type ReportProperty =
  | ({
      chartType: ChartTypeWithOptionalMode;
      chartMode?: ChartMode;
    } & ChartProps)
  | ({
      chartType: ChartTypeWithRequiredMode;
      chartMode: ChartMode;
    } & ChartProps);

type PeriodicReportForParameters = {
  active?: boolean | string;
  period?:
    | PeriodReportPeriodYear
    | PeriodReportPeriodDay
    | PeriodReportPeriodQuater
    | PeriodReportPeriodMonth
    | PeriodReportPeriodWeek
    | PeriodReportPeriodHour;
};

type PeriodReportPeriodYear = {
  every: "YEAR";
  month: MonthOfYear;
  time: string;
  dayOfMonth: DayOfMonth;
};

type PeriodReportPeriodQuater = {
  every: "QUARTER";
  pattern: QuarterPattern;
  time: string;
  dayOfMonth: DayOfMonth | EndOfMonth;
};

type PeriodReportPeriodMonth = {
  every: "MONTH";
  time: string;
  dayOfMonth: DayOfMonth | EndOfMonth;
};

type PeriodReportPeriodWeek = {
  every: "WEEK";
  dayOfWeek: DayOfWeek;
  time: string;
};

type PeriodReportPeriodDay = {
  every: "DAY";
  time: string;
};

type PeriodReportPeriodHour = {
  every: "HOUR";
  minute: MinuteOfHour;
};

// --- Types for response ---

export type ReportForResponse =
  | ReportForResponseWithoutMode
  | ReportForResponseWithMode;

type ReportForResponseBase = {
  chartType: ChartType;
  id: string;
  name: string;
  index: string;
  groups: Group[];
  aggregations: Aggregation[];
  filterCond: string;
  sorts: Sort[];
  periodicReport: PeriodicReport | null;
};

type ReportForResponseWithoutMode = ReportForResponseBase & {
  chartType: Exclude<ChartType, ChartTypeWithMode>;
};

type ReportForResponseWithMode = ReportForResponseBase & {
  chartType: ChartTypeWithMode;
  chartMode: ChartMode;
};

type ChartType =
  | "PIE"
  | "LINE"
  | "SPLINE"
  | "TABLE"
  | "PIVOT_TABLE"
  | "BAR"
  | "COLUMN"
  | "AREA"
  | "SPLINE_AREA";

type ChartTypeWithMode = Extract<
  ChartType,
  "BAR" | "COLUMN" | "AREA" | "SPLINE_AREA"
>;

type Group = {
  code: string;
  per: GroupPer;
};

type PeriodicReport = {
  active: boolean;
  period: PeriodicReportPeriod;
};

type PeriodicReportPeriod =
  | PeriodicReportPeriodYear
  | PeriodicReportPeriodQuarter
  | PeriodicReportPeriodMonth
  | PeriodicReportPeriodWeek
  | PeriodicReportPeriodDay
  | PeriodicReportPeriodHour;

type PeriodicReportPeriodEvery =
  | "YEAR"
  | "QUARTER"
  | "MONTH"
  | "WEEK"
  | "DAY"
  | "HOUR"
  | "MINUTE";

type PeriodicReportPeriodYear = {
  every: Extract<PeriodicReportPeriodEvery, "YEAR">;
  month: MonthOfYear;
  dayOfMonth: DayOfMonth;
  time: string;
};

type PeriodicReportPeriodQuarter = {
  every: Extract<PeriodicReportPeriodEvery, "QUARTER">;
  pattern: QuarterPattern;
  dayOfMonth: DayOfMonth | EndOfMonth;
  time: string;
};

type PeriodicReportPeriodMonth = {
  every: Extract<PeriodicReportPeriodEvery, "MONTH">;
  dayOfMonth: DayOfMonth | EndOfMonth;
  time: string;
};

type PeriodicReportPeriodWeek = {
  every: Extract<PeriodicReportPeriodEvery, "WEEK">;
  dayOfWeek: DayOfWeek;
  time: string;
};

type PeriodicReportPeriodDay = {
  every: Extract<PeriodicReportPeriodEvery, "DAY">;
  time: string;
};

type PeriodicReportPeriodHour = {
  every: Extract<PeriodicReportPeriodEvery, "HOUR">;
  minute: MinuteOfHour;
};

// --- Common types for both request and response ---

type Sort = {
  by: "TOTAL" | "GROUP1" | "GROUP2" | "GROUP3";
  order: "ASC" | "DESC";
};

type GroupPer =
  | "YEAR"
  | "QUARTER"
  | "MONTH"
  | "WEEK"
  | "DAY"
  | "HOUR"
  | "MINUTE";

type Aggregation =
  | {
      type: "COUNT";
    }
  | {
      type: "SUM" | "AVERAGE" | "MAX" | "MIN";
      code: string;
    };

type ChartMode = "NORMAL" | "STACKED" | "PERCENTAGE";

type QuarterPattern = "JAN_APR_JUL_OCT" | "FEB_MAY_AUG_NOV" | "MAR_JUN_SEP_DEC";

type MonthOfYear =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

type DayOfWeek =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

type DayOfMonth =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "26"
  | "27"
  | "28"
  | "29"
  | "30"
  | "31";

type EndOfMonth = "END_OF_MONTH";

type MinuteOfHour = "0" | "10" | "20" | "30" | "40" | "50";
