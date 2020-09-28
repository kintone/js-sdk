export type FieldLayoutWith<
  T extends string,
  S extends unknown = { width: string }
> = {
  type: T;
  code: string;
  size: S;
};

export type RecordNumber = FieldLayoutWith<"RECORD_NUMBER">;
export type Creator = FieldLayoutWith<"CREATOR">;
export type CreatedTime = FieldLayoutWith<"CREATED_TIME">;
export type Modifier = FieldLayoutWith<"MODIFIER">;
export type UpdatedTime = FieldLayoutWith<"UPDATED_TIME">;
export type SingleLineText = FieldLayoutWith<"SINGLE_LINE_TEXT">;
export type Number = FieldLayoutWith<"NUMBER">;
export type Calc = FieldLayoutWith<"CALC">;
export type MultiLineText = FieldLayoutWith<
  "MULTI_LINE_TEXT",
  { width: string; innerHeight: string }
>;
export type RichText = FieldLayoutWith<
  "RICH_TEXT",
  { width: string; innerHeight: string }
>;
export type Link = FieldLayoutWith<"LINK">;
export type CheckBox = FieldLayoutWith<"CHECK_BOX">;
export type RadioButton = FieldLayoutWith<"RADIO_BUTTON">;
export type Dropdown = FieldLayoutWith<"DROP_DOWN">;
export type MultiSelect = FieldLayoutWith<"MULTI_SELECT">;
export type File = FieldLayoutWith<"FILE">;
export type Date = FieldLayoutWith<"DATE">;
export type Time = FieldLayoutWith<"TIME">;
export type DateTime = FieldLayoutWith<"DATETIME">;
export type UserSelect = FieldLayoutWith<"USER_SELECT">;
export type OrganizationSelect = FieldLayoutWith<"ORGANIZATION_SELECT">;
export type GroupSelect = FieldLayoutWith<"GROUP_SELECT">;

export type ReferenceTable = {
  type: "REFERENCE_TABLE";
  code: string;
};

export type Label = {
  type: "LABEL";
  label: string;
  size: {
    width: string;
  };
};
export type HR = {
  type: "HR";
  size: {
    width: string;
  };
};
export type Spacer = {
  type: "SPACER";
  elementId: string;
  size: {
    width: string;
    height: string;
  };
};

export type OneOf =
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
  | ReferenceTable
  | Label
  | HR
  | Spacer;
