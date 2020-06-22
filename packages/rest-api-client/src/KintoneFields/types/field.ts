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

type CheckBoxField = FieldWith<"CHECK_BOX", string[]>;
type RadioButtonField = FieldWith<"RADIO_BUTTON", string>;
type DropdownField = FieldWith<"DROP_DOWN", string | null>;
type MultiSelectField<> = FieldWith<"MULTI_SELECT", string[]>;

type FileField = FieldWith<"FILE", FileInformation[]>;

type DateField = FieldWith<"DATE", string | null>;
type TimeField = FieldWith<"TIME", string | null>;
type DateTimeField = FieldWith<"DATETIME", string>;

type UserSelectField = FieldWith<"USER_SELECT", Entity[]>;
type OrganizationSelectField = FieldWith<"ORGANIZATION_SELECT", Entity[]>;
type GroupSelectField = FieldWith<"GROUP_SELECT", Entity[]>;

type CategoryField = FieldWith<"CATEGORY", string[]>;
type StatusField = FieldWith<"STATUS", string>;
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
  | DropdownField
  | MultiSelectField
  | FileField
  | DateField
  | TimeField
  | DateTimeField
  | UserSelectField
  | OrganizationSelectField
  | GroupSelectField;

type SubtableRow<T extends object> = {
  id: string;
  value: T;
};

type SubtableField<T extends object> = FieldWith<
  "SUBTABLE",
  Array<SubtableRow<T>>
>;

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
