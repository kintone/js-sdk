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

type ChartMode = "NORMAL" | "STACKED" | "PERCENTAGE";

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

type Sort = {
  by: "TOTAL" | "GROUP1" | "GROUP2" | "GROUP3";
  order: "ASC" | "DESC";
};

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

type EndOfMonth = "END_OF_MONTH";

type QuarterPattern = "JAN_APR_JUL_OCT" | "FEB_MAY_AUG_NOV" | "MAR_JUN_SEP_DEC";

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

type MinuteOfHour = "0" | "10" | "20" | "30" | "40" | "50";

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
