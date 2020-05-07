type RecordNumberFieldProperty = {
  type: "RECORD_NUMBER";
  code: string;
  label: string;
  noLabel: boolean;
};

type CreatorFieldProperty = {
  type: "CREATOR";
  code: string;
  label: string;
  noLabel: boolean;
};

type CreatedTimeFieldProperty = {
  type: "CREATED_TIME";
  code: string;
  label: string;
  noLabel: boolean;
};

type ModifierFieldProperty = {
  type: "MODIFIER";
  code: string;
  label: string;
  noLabel: boolean;
};

type UpdatedTimeFieldProperty = {
  type: "UPDATED_TIME";
  code: string;
  label: string;
  noLabel: boolean;
};

type CategoryFieldProperty = {
  type: "CATEGORY";
  code: string;
  label: string;
  enabled: boolean;
};

type StatusFieldProperty = {
  type: "STATUS";
  code: string;
  label: string;
  enabled: boolean;
};

type StatusAssigneeFieldProperty = {
  type: "STATUS_ASSIGNEE";
  code: string;
  label: string;
  enabled: boolean;
};

type SingleLineTextFieldProperty = {
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

type NumberFieldProperty = {
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

type CalcFieldProperty = {
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

type MultiLineTextFieldProperty = {
  type: "MULTI_LINE_TEXT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
};

type RichTextFieldProperty = {
  type: "RICH_TEXT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
};

type LinkFieldProperty = {
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

type CheckBoxFieldProperty = {
  type: "CHECK_BOX";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string[];
  options: Options;
  align: "HORIZONTAL" | "VERTICAL";
};

type RadioButtonFieldProperty = {
  type: "RADIO_BUTTON";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  options: Options;
  align: "HORIZONTAL" | "VERTICAL";
};

type DropDownFieldProperty = {
  type: "DROP_DOWN";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  options: Options;
};

type MultiSelectFieldProperty = {
  type: "MULTI_SELECT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string[];
  options: Options;
};

type FileFieldProperty = {
  type: "FILE";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  thumbnailSize: "50" | "150" | "250" | "500";
};

type DateFieldProperty = {
  type: "DATE";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  unique: boolean;
  defaultNowValue: boolean;
};

type TimeFieldProperty = {
  type: "TIME";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  defaultNowValue: boolean;
};

type DateTimeFieldProperty = {
  type: "DATETIME";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  unique: boolean;
  defaultNowValue: boolean;
};

type UserSelectFieldProperty = {
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

type OrganizationSelectFieldProperty = {
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

type GroupSelectFieldProperty = {
  type: "GROUP_SELECT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: Array<{ code: string; type: "GROUP" }>;
  entities: Array<{ code: string; type: "GROUP" }>;
};

type GroupFieldProperty = {
  type: "GROUP";
  code: string;
  label: string;
  noLabel: boolean;
  openGroup: boolean;
};

type ReferenceTableFieldProperty = {
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

type LookupFieldProperty = {
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

type FieldPropertyInSubtable =
  | SingleLineTextFieldProperty
  | NumberFieldProperty
  | CalcFieldProperty
  | MultiLineTextFieldProperty
  | RichTextFieldProperty
  | LinkFieldProperty
  | CheckBoxFieldProperty
  | RadioButtonFieldProperty
  | DropDownFieldProperty
  | MultiSelectFieldProperty
  | FileFieldProperty
  | DateFieldProperty
  | TimeFieldProperty
  | DateTimeFieldProperty
  | UserSelectFieldProperty
  | OrganizationSelectFieldProperty
  | GroupSelectFieldProperty
  | LookupFieldProperty;

type SubtableFieldProperty = {
  type: "SUBTABLE";
  code: string;
  label: string;
  noLabel: boolean;
  fields: {
    [fieldCode: string]: FieldPropertyInSubtable;
  };
};

export type FieldProperty =
  | RecordNumberFieldProperty
  | CreatorFieldProperty
  | CreatedTimeFieldProperty
  | ModifierFieldProperty
  | UpdatedTimeFieldProperty
  | CategoryFieldProperty
  | StatusFieldProperty
  | StatusAssigneeFieldProperty
  | SingleLineTextFieldProperty
  | NumberFieldProperty
  | CalcFieldProperty
  | MultiLineTextFieldProperty
  | RichTextFieldProperty
  | LinkFieldProperty
  | CheckBoxFieldProperty
  | RadioButtonFieldProperty
  | DropDownFieldProperty
  | MultiSelectFieldProperty
  | FileFieldProperty
  | DateFieldProperty
  | TimeFieldProperty
  | DateTimeFieldProperty
  | UserSelectFieldProperty
  | OrganizationSelectFieldProperty
  | GroupSelectFieldProperty
  | GroupFieldProperty
  | ReferenceTableFieldProperty
  | LookupFieldProperty
  | SubtableFieldProperty;
