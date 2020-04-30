type RecordNumberField = {
  type: "RECORD_NUMBER";
  code: string;
  label: string;
  noLabel: boolean;
};

type CreatorField = {
  type: "CREATOR";
  code: string;
  label: string;
  noLabel: boolean;
};

type CreatedTimeField = {
  type: "CREATED_TIME";
  code: string;
  label: string;
  noLabel: boolean;
};

type ModifierField = {
  type: "MODIFIER";
  code: string;
  label: string;
  noLabel: boolean;
};

type UpdatedTimeField = {
  type: "UPDATED_TIME";
  code: string;
  label: string;
  noLabel: boolean;
};

type CategoryField = {
  type: "CATEGORY";
  code: string;
  label: string;
  enabled: boolean;
};

type StatusField = {
  type: "STATUS";
  code: string;
  label: string;
  enabled: boolean;
};

type StatusAssigneeField = {
  type: "STATUS_ASSIGNEE";
  code: string;
  label: string;
  enabled: boolean;
};

type SingleLineTextField = {
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

type NumberField = {
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

type CalcField = {
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

type MultiLineTextField = {
  type: "MULTI_LINE_TEXT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
};

type RichTextField = {
  type: "RICH_TEXT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
};

type LinkField = {
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

type CheckBoxField = {
  type: "CHECK_BOX";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string[];
  options: Options;
  align: "HORIZONTAL" | "VERTICAL";
};

type RadioButtonField = {
  type: "RADIO_BUTTON";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  options: Options;
  align: "HORIZONTAL" | "VERTICAL";
};

type DropDownField = {
  type: "DROP_DOWN";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  options: Options;
};

type MultiSelectField = {
  type: "MULTI_SELECT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string[];
  options: Options;
};

type FileField = {
  type: "FILE";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  thumbnailSize: "50" | "150" | "250" | "500";
};

type DateField = {
  type: "DATE";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  unique: boolean;
  defaultNowValue: boolean;
};

type TimeField = {
  type: "TIME";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  defaultNowValue: boolean;
};

type DateTimeField = {
  type: "DATETIME";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  unique: boolean;
  defaultNowValue: boolean;
};

type UserSelectField = {
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

type OrganizationSelectField = {
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

type GroupSelectField = {
  type: "GROUP_SELECT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: Array<{ code: string; type: "GROUP" }>;
  entities: Array<{ code: string; type: "GROUP" }>;
};

type GroupField = {
  type: "GROUP";
  code: string;
  label: string;
  noLabel: boolean;
  openGroup: boolean;
};

type ReferenceTableField = {
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

type LookupField = {
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

type FieldInSubtable =
  | SingleLineTextField
  | NumberField
  | CalcField
  | MultiLineTextField
  | RichTextField
  | LinkField
  | CheckBoxField
  | RadioButtonField
  | DropDownField
  | MultiSelectField
  | FileField
  | DateField
  | TimeField
  | DateTimeField
  | UserSelectField
  | OrganizationSelectField
  | GroupSelectField
  | LookupField;

type SubtableField = {
  type: "SUBTABLE";
  code: string;
  label: string;
  noLabel: boolean;
  fields: {
    [fieldCode: string]: FieldInSubtable;
  };
};

export type Field =
  | RecordNumberField
  | CreatorField
  | CreatedTimeField
  | ModifierField
  | UpdatedTimeField
  | CategoryField
  | StatusField
  | StatusAssigneeField
  | SingleLineTextField
  | NumberField
  | CalcField
  | MultiLineTextField
  | RichTextField
  | LinkField
  | CheckBoxField
  | RadioButtonField
  | DropDownField
  | MultiSelectField
  | FileField
  | DateField
  | TimeField
  | DateTimeField
  | UserSelectField
  | OrganizationSelectField
  | GroupSelectField
  | GroupField
  | ReferenceTableField
  | LookupField
  | SubtableField;
