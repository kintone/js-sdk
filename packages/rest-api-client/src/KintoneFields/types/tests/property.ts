import {
  RecordNumberFieldProperty,
  CreatorFieldProperty,
  CreatedTimeFieldProperty,
  ModifierFieldProperty,
  UpdatedTimeFieldProperty,
  CategoryFieldProperty,
  StatusFieldProperty,
  StatusAssigneeFieldProperty,
  SingleLineTextFieldProperty,
  NumberFieldProperty,
  CalcFieldProperty,
  MultiLineTextFieldProperty,
  RichTextFieldProperty,
  LinkFieldProperty,
  CheckBoxFieldProperty,
  RadioButtonFieldProperty,
  DropdownFieldProperty,
  MultiSelectFieldProperty,
  FileFieldProperty,
  DateFieldProperty,
  TimeFieldProperty,
  DateTimeFieldProperty,
  UserSelectFieldProperty,
  OrganizationSelectFieldProperty,
  GroupSelectFieldProperty,
  GroupFieldProperty,
  ReferenceTableFieldProperty,
  LookupFieldProperty,
  SubtableFieldProperty,
} from "../property";

type Test_SubtableFieldProperty_OK = SubtableFieldProperty<{
  SingleLineText: SingleLineTextFieldProperty;
  Number: NumberFieldProperty;
  Calc: CalcFieldProperty;
  MultiLineText: MultiLineTextFieldProperty;
  RichText: RichTextFieldProperty;
  Link: LinkFieldProperty;
  CheckBox: CheckBoxFieldProperty;
  RadioButton: RadioButtonFieldProperty;
  Dropdown: DropdownFieldProperty;
  MultiSelect: MultiSelectFieldProperty;
  File: FileFieldProperty;
  Date: DateFieldProperty;
  Time: TimeFieldProperty;
  DateTime: DateTimeFieldProperty;
  UserSelect: UserSelectFieldProperty;
  OrganizationSelect: OrganizationSelectFieldProperty;
  GroupSelect: GroupSelectFieldProperty;
  Lookup: LookupFieldProperty;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_RecordNumber = SubtableFieldProperty<{
  RecordNumber: RecordNumberFieldProperty;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_Creator = SubtableFieldProperty<{
  Creator: CreatorFieldProperty;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_CreatedTime = SubtableFieldProperty<{
  CreatedTime: CreatedTimeFieldProperty;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_Modifier = SubtableFieldProperty<{
  Modifier: ModifierFieldProperty;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_UpdatedTime = SubtableFieldProperty<{
  UpdatedTime: UpdatedTimeFieldProperty;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_Category = SubtableFieldProperty<{
  Category: CategoryFieldProperty;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_Status = SubtableFieldProperty<{
  Status: StatusFieldProperty;
}>;
// @ts-expect-error
type Test_SubtableFieldProperty_NG_StatusAssignee = SubtableFieldProperty<{
  StatusAssignee: StatusAssigneeFieldProperty;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_Group = SubtableFieldProperty<{
  Group: GroupFieldProperty;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_ReferenceTable = SubtableFieldProperty<{
  ReferenceTable: ReferenceTableFieldProperty;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_Subtable = SubtableFieldProperty<{
  Subtable: Test_SubtableFieldProperty_OK;
}>;
