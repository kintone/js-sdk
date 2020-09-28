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

export type ID = FieldWith<"__ID__", string>;
export type Revision = FieldWith<"__REVISION__", string>;
export type RecordNumber = FieldWith<"RECORD_NUMBER", string>;
export type Creator = FieldWith<"CREATOR", Entity>;
export type CreatedTime = FieldWith<"CREATED_TIME", string>;
export type Modifier = FieldWith<"MODIFIER", Entity>;
export type UpdatedTime = FieldWith<"UPDATED_TIME", string>;

export type SingleLineText = FieldWith<"SINGLE_LINE_TEXT", string>;
export type Number = FieldWith<"NUMBER", string>;
export type Calc = FieldWith<"CALC", string>;
export type MultiLineText = FieldWith<"MULTI_LINE_TEXT", string>;
export type RichText = FieldWith<"RICH_TEXT", string>;
export type Link = FieldWith<"LINK", string>;

export type CheckBox = FieldWith<"CHECK_BOX", string[]>;
export type RadioButton = FieldWith<"RADIO_BUTTON", string>;
export type Dropdown = FieldWith<"DROP_DOWN", string | null>;
export type MultiSelect = FieldWith<"MULTI_SELECT", string[]>;

export type File = FieldWith<"FILE", FileInformation[]>;

export type Date = FieldWith<"DATE", string | null>;
export type Time = FieldWith<"TIME", string | null>;
export type DateTime = FieldWith<"DATETIME", string>;

export type UserSelect = FieldWith<"USER_SELECT", Entity[]>;
export type OrganizationSelect = FieldWith<"ORGANIZATION_SELECT", Entity[]>;
export type GroupSelect = FieldWith<"GROUP_SELECT", Entity[]>;

export type Category = FieldWith<"CATEGORY", string[]>;
export type Status = FieldWith<"STATUS", string>;
export type StatusAssignee = FieldWith<"STATUS_ASSIGNEE", Entity[]>;

export type InSubtable =
  | SingleLineText
  | Number // eslint-disable-line
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
  | GroupSelect;

type SubtableRow<T extends { [fieldCode: string]: InSubtable }> = {
  id: string;
  value: T;
};

export type Subtable<T extends { [fieldCode: string]: InSubtable }> = FieldWith<
  "SUBTABLE",
  Array<SubtableRow<T>>
>;

export type OneOf =
  | ID
  | Revision
  | RecordNumber
  | Creator
  | CreatedTime
  | Modifier
  | UpdatedTime
  | SingleLineText
  | Number // eslint-disable-line
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
  | Category
  | Status
  | StatusAssignee
  | Subtable<{
      [fieldCode: string]: InSubtable;
    }>;
