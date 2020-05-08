type FieldLayoutWith<
  T extends string,
  S extends unknown = { width: string }
> = {
  type: T;
  code: string;
  size: S;
};

type RecordNumberFieldLayout = FieldLayoutWith<"RECORD_NUMBER">;
type CreatorFieldLayout = FieldLayoutWith<"CREATOR">;
type CreatedTimeFieldLayout = FieldLayoutWith<"CREATED_TIME">;
type ModifierFieldLayout = FieldLayoutWith<"MODIFIER">;
type UpdatedTimeFieldLayout = FieldLayoutWith<"UPDATED_TIME">;
type SingleLineTextFieldLayout = FieldLayoutWith<"SINGLE_LINE_TEXT">;
type NumberFieldLayout = FieldLayoutWith<"NUMBER">;
type CalcFieldLayout = FieldLayoutWith<"CALC">;
type MultiLineTextFieldLayout = FieldLayoutWith<
  "MULTI_LINE_TEXT",
  { width: string; innerHeight: string }
>;
type RichTextFieldLayout = FieldLayoutWith<
  "RICH_TEXT",
  { width: string; innerHeight: string }
>;
type LinkFieldLayout = FieldLayoutWith<"LINK">;
type CheckBoxFieldLayout = FieldLayoutWith<"CHECK_BOX">;
type RadioButtonFieldLayout = FieldLayoutWith<"RADIO_BUTTON">;
type DropDownFieldLayout = FieldLayoutWith<"DROP_DOWN">;
type MultiSelectFieldLayout = FieldLayoutWith<"MULTI_SELECT">;
type FileFieldLayout = FieldLayoutWith<"FILE">;
type DateFieldLayout = FieldLayoutWith<"DATE">;
type TimeFieldLayout = FieldLayoutWith<"TIME">;
type DateTimeFieldLayout = FieldLayoutWith<"DATETIME">;
type UserSelectFieldLayout = FieldLayoutWith<"USER_SELECT">;
type OrganizationSelectFieldLayout = FieldLayoutWith<"ORGANIZATION_SELECT">;
type GroupSelectFieldLayout = FieldLayoutWith<"GROUP_SELECT">;

type ReferenceTableFieldLayout = { type: "REFERENCE_TABLE"; code: string };

type LabelFieldLayout = {
  type: "LABEL";
  label: string;
  size: {
    width: string;
  };
};
type HRFieldLayout = {
  type: "HR";
  size: {
    width: string;
  };
};
type SpacerFieldLayout = {
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
  | DropDownFieldLayout
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

type RowLayout = { type: "ROW"; fields: FieldLayout[] };
type SubTableLayout = {
  type: "SUBTABLE";
  code: string;
  fields: FieldLayoutInSubtable[];
};
type GroupLayout = {
  type: "GROUP";
  code: string;
  layout: RowLayout[];
};

export type Layout = Array<RowLayout | SubTableLayout | GroupLayout>;
