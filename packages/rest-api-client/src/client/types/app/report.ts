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

type ChartMode = "NORMAL" | "STACKED" | "PERCENTAGE";

type Group = {
  code: string;
  per: GroupPer;
};

type GroupPer =
  | "YEAR"
  | "QUARTER"
  | "MONTH"
  | "WEEK"
  | "DAY"
  | "HOUR"
  | "MINUTE";

type Aggregation = RecordAggregation | FieldAggregation;

type AggregatonType = "COUNT" | "SUM" | "AVERAGE" | "MAX" | "MIN";
type RecordAggregationType = Extract<AggregatonType, "COUNT">;

type RecordAggregation = {
  type: RecordAggregationType;
};

type FieldAggregation = {
  type: Exclude<AggregatonType, RecordAggregationType>;
  code: string;
};

type Sort = {
  by: "TOTAL" | "GROUP1" | "GROUP2" | "GROUP3";
  order: "ASC" | "DESC";
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

type EndOfMonth = "END_OF_MONHTH";

type DayOfWeek =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

type MinuteOfHour = "0" | "10" | "20" | "30" | "40" | "50";
