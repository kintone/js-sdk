import {
  SubtableField,
  IDField,
  RevisionField,
  RecordNumberField,
  CreatorField,
  CreatedTimeField,
  ModifierField,
  UpdatedTimeField,
  SingleLineTextField,
  NumberField,
  CalcField,
  MultiLineTextField,
  RichTextField,
  LinkField,
  CheckBoxField,
  RadioButtonField,
  DropdownField,
  MultiSelectField,
  FileField,
  DateField,
  TimeField,
  DateTimeField,
  UserSelectField,
  OrganizationSelectField,
  GroupSelectField,
  CategoryField,
  StatusField,
  StatusAssigneeField,
} from "../field";

type Test_SubtableField_OK = SubtableField<{
  SingleLineText: SingleLineTextField;
  Number: NumberField;
  Calc: CalcField;
  MultiLineText: MultiLineTextField;
  RichText: RichTextField;
  Link: LinkField;
  CheckBox: CheckBoxField;
  RadioButton: RadioButtonField;
  Dropdown: DropdownField;
  MultiSelect: MultiSelectField;
  File: FileField;
  Date: DateField;
  Time: TimeField;
  DateTime: DateTimeField;
  UserSelect: UserSelectField;
  OrganizationSelect: OrganizationSelectField;
  GroupSelect: GroupSelectField;
}>;

// @ts-expect-error
type Test_SubtableField_NG_ID = SubtableField<{ $id: IDField }>;

// @ts-expect-error
type Test_SubtableField_NG_Revision = SubtableField<{
  $revision: RevisionField;
}>;

// @ts-expect-error
type Test_SubtableField_NG_RecordNumber = SubtableField<{
  RecordNumber: RecordNumberField;
}>;

// @ts-expect-error
type Test_SubtableField_NG_Creator = SubtableField<{ Creator: CreatorField }>;

// @ts-expect-error
type Test_SubtableField_NG_CreatedTime = SubtableField<{
  CreatedTime: CreatedTimeField;
}>;

// @ts-expect-error
type Test_SubtableField_NG_Modifier = SubtableField<{
  Modifier: ModifierField;
}>;

// @ts-expect-error
type Test_SubtableField_NG_UpdatedTime = SubtableField<{
  UpdatedTime: UpdatedTimeField;
}>;

// @ts-expect-error
type Test_SubtableField_NG_Category = SubtableField<{
  Category: CategoryField;
}>;

// @ts-expect-error
type Test_SubtableField_NG_Status = SubtableField<{ Status: StatusField }>;

// @ts-expect-error
type Test_SubtableField_NG_StatusAssignee = SubtableField<{
  StatusAssignee: StatusAssigneeField;
}>;

// @ts-expect-error
type Test_SubtableField_NG_Subtable = SubtableField<{
  Subtable: SubtableField<{ SingleLineText: SingleLineTextField }>;
}>;
