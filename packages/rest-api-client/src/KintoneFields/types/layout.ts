type FieldLayoutWith<
  T extends string,
  S extends unknown = { width: string }
> = {
  type: T;
  code: string;
  size: S;
};

export type RecordNumberFieldLayout = FieldLayoutWith<"RECORD_NUMBER">;
export type CreatorFieldLayout = FieldLayoutWith<"CREATOR">;
export type CreatedTimeFieldLayout = FieldLayoutWith<"CREATED_TIME">;
export type ModifierFieldLayout = FieldLayoutWith<"MODIFIER">;
export type UpdatedTimeFieldLayout = FieldLayoutWith<"UPDATED_TIME">;
export type SingleLineTextFieldLayout = FieldLayoutWith<"SINGLE_LINE_TEXT">;
export type NumberFieldLayout = FieldLayoutWith<"NUMBER">;
export type CalcFieldLayout = FieldLayoutWith<"CALC">;
export type MultiLineTextFieldLayout = FieldLayoutWith<
  "MULTI_LINE_TEXT",
  { width: string; innerHeight: string }
>;
export type RichTextFieldLayout = FieldLayoutWith<
  "RICH_TEXT",
  { width: string; innerHeight: string }
>;
export type LinkFieldLayout = FieldLayoutWith<"LINK">;
export type CheckBoxFieldLayout = FieldLayoutWith<"CHECK_BOX">;
export type RadioButtonFieldLayout = FieldLayoutWith<"RADIO_BUTTON">;
export type DropdownFieldLayout = FieldLayoutWith<"DROP_DOWN">;
export type MultiSelectFieldLayout = FieldLayoutWith<"MULTI_SELECT">;
export type FileFieldLayout = FieldLayoutWith<"FILE">;
export type DateFieldLayout = FieldLayoutWith<"DATE">;
export type TimeFieldLayout = FieldLayoutWith<"TIME">;
export type DateTimeFieldLayout = FieldLayoutWith<"DATETIME">;
export type UserSelectFieldLayout = FieldLayoutWith<"USER_SELECT">;
export type OrganizationSelectFieldLayout = FieldLayoutWith<
  "ORGANIZATION_SELECT"
>;
export type GroupSelectFieldLayout = FieldLayoutWith<"GROUP_SELECT">;

export type ReferenceTableFieldLayout = {
  type: "REFERENCE_TABLE";
  code: string;
};

export type LabelFieldLayout = {
  type: "LABEL";
  label: string;
  size: {
    width: string;
  };
};
export type HRFieldLayout = {
  type: "HR";
  size: {
    width: string;
  };
};
export type SpacerFieldLayout = {
  type: "SPACER";
  elementId: string;
  size: {
    width: string;
    height: string;
  };
};

type FieldLayout =
  | RecordNumberFieldLayout
  | CreatorFieldLayout
  | CreatedTimeFieldLayout
  | ModifierFieldLayout
  | UpdatedTimeFieldLayout
  | SingleLineTextFieldLayout
  | NumberFieldLayout
  | CalcFieldLayout
  | MultiLineTextFieldLayout
  | RichTextFieldLayout
  | LinkFieldLayout
  | CheckBoxFieldLayout
  | RadioButtonFieldLayout
  | DropdownFieldLayout
  | MultiSelectFieldLayout
  | FileFieldLayout
  | DateFieldLayout
  | TimeFieldLayout
  | DateTimeFieldLayout
  | UserSelectFieldLayout
  | OrganizationSelectFieldLayout
  | GroupSelectFieldLayout
  | ReferenceTableFieldLayout
  | LabelFieldLayout
  | HRFieldLayout
  | SpacerFieldLayout;

type FieldLayoutInSubtable = Exclude<
  FieldLayout,
  | RecordNumberFieldLayout
  | CreatorFieldLayout
  | CreatedTimeFieldLayout
  | ModifierFieldLayout
  | UpdatedTimeFieldLayout
  | ReferenceTableFieldLayout
  | LabelFieldLayout
  | HRFieldLayout
  | SpacerFieldLayout
>;

export type RowLayout<T extends FieldLayout[]> = { type: "ROW"; fields: T };

export type SubtableLayout<T extends FieldLayoutInSubtable[]> = {
  type: "SUBTABLE";
  code: string;
  fields: T;
};
export type GroupLayout<T extends Array<RowLayout<FieldLayout[]>>> = {
  type: "GROUP";
  code: string;
  layout: T;
};

export type Layout = Array<
  | RowLayout<FieldLayout[]>
  | SubtableLayout<FieldLayoutInSubtable[]>
  | GroupLayout<Array<RowLayout<FieldLayout[]>>>
>;
