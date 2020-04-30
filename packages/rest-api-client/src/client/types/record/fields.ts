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

type IDField = FieldWith<"__ID__", string>;
type RevisionField = FieldWith<"__REVISION__", string>;
type RecordNumberField = FieldWith<"RECORD_NUMBER", string>;
type CreatorField = FieldWith<"CREATOR", Entity>;
type CreatedTimeField = FieldWith<"CREATED_TIME", string>;
type ModifierField = FieldWith<"MODIFIER", Entity>;
type UpdatedTimeField = FieldWith<"UPDATED_TIME", string>;

type SingleLineTextField = FieldWith<"SINGLE_LINE_TEXT", string>;
type NumberField = FieldWith<"NUMBER", string>;
type CalcField = FieldWith<"CALC", string>;
type MultiLineTextField = FieldWith<"MULTI_LINE_TEXT", string>;
type RichTextField = FieldWith<"RICH_TEXT", string>;
type LinkField = FieldWith<"LINK", string>;

type CheckBoxField<T extends string = string> = FieldWith<"CHECK_BOX", T[]>;
type RadioButtonField<T extends string = string> = FieldWith<"RADIO_BUTTON", T>;
type DropDownField<T extends string | null = string | null> = FieldWith<
  "DROP_DOWN",
  T
>;
type MultiSelectField<T extends string = string> = FieldWith<
  "MULTI_SELECT",
  T[]
>;

type FileField = FieldWith<"FILE", FileInformation[]>;

type DateField = FieldWith<"DATE", string | null>;
type TimeField = FieldWith<"TIME", string | null>;
type DateTimeField = FieldWith<"DATETIME", string>;

type UserSelectField = FieldWith<"USER_SELECT", Entity[]>;
type OrganizationSelectField = FieldWith<"ORGANIZATION_SELECT", Entity[]>;
type GroupSelectField = FieldWith<"GROUP_SELECT", Entity[]>;

type CategoryField<T extends string = string> = FieldWith<"CATEGORY", T[]>;
type StatusField<T extends string = string> = FieldWith<"STATUS", T>;
type StatusAssigneeField = FieldWith<"STATUS_ASSIGNEE", Entity[]>;

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
  | GroupSelectField;

type SubtableRow = {
  id: string;
  value: {
    [fieldCode: string]: FieldInSubtable;
  };
};

type SubtableField = FieldWith<"SUBTABLE", SubtableRow[]>;

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
  | DropDownField
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
  | SubtableField;
