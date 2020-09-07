type FieldWith<T extends string, V> = {
  type: T;
  value: V;
};

type Entity = {
  code: string;
  name: string;
};

type FileInformation = {
  contentType: string;
  fileKey: string;
  name: string;
  size: string;
};

export type IDField = FieldWith<"__ID__", string>;
export type RevisionField = FieldWith<"__REVISION__", string>;
export type RecordNumberField = FieldWith<"RECORD_NUMBER", string>;
export type CreatorField = FieldWith<"CREATOR", Entity>;
export type CreatedTimeField = FieldWith<"CREATED_TIME", string>;
export type ModifierField = FieldWith<"MODIFIER", Entity>;
export type UpdatedTimeField = FieldWith<"UPDATED_TIME", string>;

export type SingleLineTextField = FieldWith<"SINGLE_LINE_TEXT", string>;
export type NumberField = FieldWith<"NUMBER", string>;
export type CalcField = FieldWith<"CALC", string>;
export type MultiLineTextField = FieldWith<"MULTI_LINE_TEXT", string>;
export type RichTextField = FieldWith<"RICH_TEXT", string>;
export type LinkField = FieldWith<"LINK", string>;

export type CheckBoxField = FieldWith<"CHECK_BOX", string[]>;
export type RadioButtonField = FieldWith<"RADIO_BUTTON", string>;
export type DropdownField = FieldWith<"DROP_DOWN", string | null>;
export type MultiSelectField = FieldWith<"MULTI_SELECT", string[]>;

export type FileField = FieldWith<"FILE", FileInformation[]>;

export type DateField = FieldWith<"DATE", string | null>;
export type TimeField = FieldWith<"TIME", string | null>;
export type DateTimeField = FieldWith<"DATETIME", string>;

export type UserSelectField = FieldWith<"USER_SELECT", Entity[]>;
export type OrganizationSelectField = FieldWith<
  "ORGANIZATION_SELECT",
  Entity[]
>;
export type GroupSelectField = FieldWith<"GROUP_SELECT", Entity[]>;

export type CategoryField = FieldWith<"CATEGORY", string[]>;
export type StatusField = FieldWith<"STATUS", string>;
export type StatusAssigneeField = FieldWith<"STATUS_ASSIGNEE", Entity[]>;

type FieldInSubtable =
  | SingleLineTextField
  | NumberField
  | CalcField
  | MultiLineTextField
  | RichTextField
  | LinkField
  | CheckBoxField
  | RadioButtonField
  | DropdownField
  | MultiSelectField
  | FileField
  | DateField
  | TimeField
  | DateTimeField
  | UserSelectField
  | OrganizationSelectField
  | GroupSelectField;

type SubtableRow<T extends { [fieldCode: string]: FieldInSubtable }> = {
  id: string;
  value: T;
};

export type SubtableField<
  T extends { [fieldCode: string]: FieldInSubtable }
> = FieldWith<"SUBTABLE", Array<SubtableRow<T>>>;

export type Field =
  | IDField
  | RevisionField
  | RecordNumberField
  | CreatorField
  | CreatedTimeField
  | ModifierField
  | UpdatedTimeField
  | SingleLineTextField
  | NumberField
  | CalcField
  | MultiLineTextField
  | RichTextField
  | LinkField
  | CheckBoxField
  | RadioButtonField
  | DropdownField
  | MultiSelectField
  | FileField
  | DateField
  | TimeField
  | DateTimeField
  | UserSelectField
  | OrganizationSelectField
  | GroupSelectField
  | CategoryField
  | StatusField
  | StatusAssigneeField
  | SubtableField<{
      [fieldCode: string]: FieldInSubtable;
    }>;
