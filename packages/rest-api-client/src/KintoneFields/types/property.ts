export type RecordNumber = {
  type: "RECORD_NUMBER";
  code: string;
  label: string;
  noLabel: boolean;
};

export type Creator = {
  type: "CREATOR";
  code: string;
  label: string;
  noLabel: boolean;
};

export type CreatedTime = {
  type: "CREATED_TIME";
  code: string;
  label: string;
  noLabel: boolean;
};

export type Modifier = {
  type: "MODIFIER";
  code: string;
  label: string;
  noLabel: boolean;
};

export type UpdatedTime = {
  type: "UPDATED_TIME";
  code: string;
  label: string;
  noLabel: boolean;
};

export type Category = {
  type: "CATEGORY";
  code: string;
  label: string;
  enabled: boolean;
};

export type Status = {
  type: "STATUS";
  code: string;
  label: string;
  enabled: boolean;
};

export type StatusAssignee = {
  type: "STATUS_ASSIGNEE";
  code: string;
  label: string;
  enabled: boolean;
};

export type SingleLineText = {
  type: "SINGLE_LINE_TEXT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  unique: boolean;
  minLength: string;
  maxLength: string;
  expression: string;
  hideExpression: boolean;
};

export type Number = {
  type: "NUMBER";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  unique: boolean;
  minValue: string;
  maxValue: string;
  digit: boolean;
  displayScale: string;
  unit: string;
  unitPosition: "BEFORE" | "AFTER";
};

export type Calc = {
  type: "CALC";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  expression: string;
  hideExpression: boolean;
  format:
    | "NUMBER"
    | "NUMBER_DIGIT"
    | "DATETIME"
    | "DATE"
    | "TIME"
    | "HOUR_MINUTE"
    | "DAY_HOUR_MINUTE";
  displayScale: string;
  unit: string;
  unitPosition: "BEFORE" | "AFTER";
};

export type MultiLineText = {
  type: "MULTI_LINE_TEXT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
};

export type RichText = {
  type: "RICH_TEXT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
};

export type Link = {
  type: "LINK";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  unique: boolean;
  minLength: string;
  maxLength: string;
  protocol: "WEB" | "CALL" | "MAIL";
};

type Options = {
  [optionName: string]: {
    label: string;
    index: string;
  };
};

export type CheckBox = {
  type: "CHECK_BOX";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string[];
  options: Options;
  align: "HORIZONTAL" | "VERTICAL";
};

export type RadioButton = {
  type: "RADIO_BUTTON";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  options: Options;
  align: "HORIZONTAL" | "VERTICAL";
};

export type Dropdown = {
  type: "DROP_DOWN";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  options: Options;
};

export type MultiSelect = {
  type: "MULTI_SELECT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string[];
  options: Options;
};

export type File = {
  type: "FILE";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  thumbnailSize: "50" | "150" | "250" | "500";
};

export type Date = {
  type: "DATE";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  unique: boolean;
  defaultNowValue: boolean;
};

export type Time = {
  type: "TIME";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  defaultNowValue: boolean;
};

export type DateTime = {
  type: "DATETIME";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  unique: boolean;
  defaultNowValue: boolean;
};

export type UserSelect = {
  type: "USER_SELECT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: Array<
    | {
        code: string;
        type: "USER" | "GROUP" | "ORGANIZATION";
      }
    | { code: "LOGINUSER()"; type: "FUNCTION" }
  >;
  entities: Array<{ code: string; type: "USER" | "GROUP" | "ORGANIZATION" }>;
};

export type OrganizationSelect = {
  type: "ORGANIZATION_SELECT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: Array<
    | { code: string; type: "ORGANIZATION" }
    | { code: "PRIMARY_ORGANIZATION()"; type: "FUNCTION" }
  >;
  entities: Array<{ code: string; type: "ORGANIZATION" }>;
};

export type GroupSelect = {
  type: "GROUP_SELECT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: Array<{ code: string; type: "GROUP" }>;
  entities: Array<{ code: string; type: "GROUP" }>;
};

export type Group = {
  type: "GROUP";
  code: string;
  label: string;
  noLabel: boolean;
  openGroup: boolean;
};

export type ReferenceTable = {
  type: "REFERENCE_TABLE";
  code: string;
  label: string;
  noLabel: boolean;
  referenceTable: {
    relatedApp: {
      app: string;
      code: string;
    };
    condition: {
      field: string;
      relatedField: string;
    };
    filterCond: string;
    displayFields: string[];
    sort: string;
    size: "5" | "10" | "20" | "30" | "40" | "50";
  };
};

export type Lookup = {
  type: "NUMBER" | "SINGLE_LINE_TEXT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  lookup: {
    relatedApp: {
      app: string;
      code: string;
    };
    relatedKeyField: string;
    fieldMappings: Array<{ field: string; relatedField: string }>;
    lookupPickerFields: string[];
    filterCond: string;
    sort: string;
  };
};

export type InSubtable =
  | SingleLineText
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Number // Although ESLint recognizes it as primitive type, this type is defined above in this file.
  | Calc
  | MultiLineText
  | RichText
  | Link
  | CheckBox
  | RadioButton
  | Dropdown
  | MultiSelect
  | File
  | Date
  | Time
  | DateTime
  | UserSelect
  | OrganizationSelect
  | GroupSelect
  | Lookup;

export type Subtable<T extends { [fieldCode: string]: InSubtable }> = {
  type: "SUBTABLE";
  code: string;
  label: string;
  noLabel: boolean;
  fields: T;
};

export type OneOf =
  | RecordNumber
  | Creator
  | CreatedTime
  | Modifier
  | UpdatedTime
  | Category
  | Status
  | StatusAssignee
  | SingleLineText
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Number // Although ESLint recognizes it as primitive type, this type is defined above in this file.
  | Calc
  | MultiLineText
  | RichText
  | Link
  | CheckBox
  | RadioButton
  | Dropdown
  | MultiSelect
  | File
  | Date
  | Time
  | DateTime
  | UserSelect
  | OrganizationSelect
  | GroupSelect
  | Group
  | ReferenceTable
  | Lookup
  | Subtable<{
      [fieldCode: string]: InSubtable;
    }>;
