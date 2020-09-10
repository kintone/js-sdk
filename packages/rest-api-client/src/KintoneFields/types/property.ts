export type RecordNumberFieldProperty = {
  type: "RECORD_NUMBER";
  code: string;
  label: string;
  noLabel: boolean;
};

export type CreatorFieldProperty = {
  type: "CREATOR";
  code: string;
  label: string;
  noLabel: boolean;
};

export type CreatedTimeFieldProperty = {
  type: "CREATED_TIME";
  code: string;
  label: string;
  noLabel: boolean;
};

export type ModifierFieldProperty = {
  type: "MODIFIER";
  code: string;
  label: string;
  noLabel: boolean;
};

export type UpdatedTimeFieldProperty = {
  type: "UPDATED_TIME";
  code: string;
  label: string;
  noLabel: boolean;
};

export type CategoryFieldProperty = {
  type: "CATEGORY";
  code: string;
  label: string;
  enabled: boolean;
};

export type StatusFieldProperty = {
  type: "STATUS";
  code: string;
  label: string;
  enabled: boolean;
};

export type StatusAssigneeFieldProperty = {
  type: "STATUS_ASSIGNEE";
  code: string;
  label: string;
  enabled: boolean;
};

export type SingleLineTextFieldProperty = {
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

export type NumberFieldProperty = {
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

export type CalcFieldProperty = {
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

export type MultiLineTextFieldProperty = {
  type: "MULTI_LINE_TEXT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
};

export type RichTextFieldProperty = {
  type: "RICH_TEXT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
};

export type LinkFieldProperty = {
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

export type Options = {
  [optionName: string]: {
    label: string;
    index: string;
  };
};

export type CheckBoxFieldProperty = {
  type: "CHECK_BOX";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string[];
  options: Options;
  align: "HORIZONTAL" | "VERTICAL";
};

export type RadioButtonFieldProperty = {
  type: "RADIO_BUTTON";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  options: Options;
  align: "HORIZONTAL" | "VERTICAL";
};

export type DropdownFieldProperty = {
  type: "DROP_DOWN";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  options: Options;
};

export type MultiSelectFieldProperty = {
  type: "MULTI_SELECT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string[];
  options: Options;
};

export type FileFieldProperty = {
  type: "FILE";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  thumbnailSize: "50" | "150" | "250" | "500";
};

export type DateFieldProperty = {
  type: "DATE";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  unique: boolean;
  defaultNowValue: boolean;
};

export type TimeFieldProperty = {
  type: "TIME";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  defaultNowValue: boolean;
};

export type DateTimeFieldProperty = {
  type: "DATETIME";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: string;
  unique: boolean;
  defaultNowValue: boolean;
};

export type UserSelectFieldProperty = {
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

export type OrganizationSelectFieldProperty = {
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

export type GroupSelectFieldProperty = {
  type: "GROUP_SELECT";
  code: string;
  label: string;
  noLabel: boolean;
  required: boolean;
  defaultValue: Array<{ code: string; type: "GROUP" }>;
  entities: Array<{ code: string; type: "GROUP" }>;
};

export type GroupFieldProperty = {
  type: "GROUP";
  code: string;
  label: string;
  noLabel: boolean;
  openGroup: boolean;
};

export type ReferenceTableFieldProperty = {
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

export type LookupFieldProperty = {
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

export type FieldPropertyInSubtable =
  | SingleLineTextFieldProperty
  | NumberFieldProperty
  | CalcFieldProperty
  | MultiLineTextFieldProperty
  | RichTextFieldProperty
  | LinkFieldProperty
  | CheckBoxFieldProperty
  | RadioButtonFieldProperty
  | DropdownFieldProperty
  | MultiSelectFieldProperty
  | FileFieldProperty
  | DateFieldProperty
  | TimeFieldProperty
  | DateTimeFieldProperty
  | UserSelectFieldProperty
  | OrganizationSelectFieldProperty
  | GroupSelectFieldProperty
  | LookupFieldProperty;

export type SubtableFieldProperty<
  T extends { [fieldCode: string]: FieldPropertyInSubtable }
> = {
  type: "SUBTABLE";
  code: string;
  label: string;
  noLabel: boolean;
  fields: T;
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
  | DropdownFieldProperty
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
  | SubtableFieldProperty<{
      [fieldCode: string]: FieldPropertyInSubtable;
    }>;
