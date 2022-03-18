type FieldWith<V> = {
  value: V;
};

export type ID = FieldWith<never>;
export type Revision = FieldWith<never>;
export type RecordNumber = FieldWith<never>;
export type Creator = FieldWith<{ code: string }>;
export type CreatedTime = FieldWith<string>;
export type Modifier = FieldWith<{ code: string }>;
export type UpdatedTime = FieldWith<string>;
export type SingleLineText = FieldWith<string>;
export type Number = FieldWith<string>;
export type Calc = FieldWith<never>;
export type MultiLineText = FieldWith<string>;
export type RichText = FieldWith<string>;
export type Link = FieldWith<string>;
export type CheckBox = FieldWith<string[]>;
export type RadioButton = FieldWith<string>;
export type Dropdown = FieldWith<string>;
export type MultiSelect = FieldWith<string[]>;
export type File = FieldWith<Array<{ localFilePath: string }>>;
export type Date = FieldWith<string>;
export type Time = FieldWith<string>;
export type DateTime = FieldWith<string>;
export type UserSelect = FieldWith<Array<{ code: string }>>;
export type OrganizationSelect = FieldWith<Array<{ code: string }>>;
export type GroupSelect = FieldWith<Array<{ code: string }>>;
export type Category = FieldWith<never>;
export type Status = FieldWith<never>;
export type StatusAssignee = FieldWith<never>;
export type Subtable = FieldWith<
  Array<{
    id?: string;
    value: { [key: string]: InSubtable };
  }>
>;

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
  | GroupSelect;

export type OneOf =
  | ID
  | Revision
  | RecordNumber
  | Creator
  | CreatedTime
  | Modifier
  | UpdatedTime
  | SingleLineText
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Number
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
  | Subtable;
