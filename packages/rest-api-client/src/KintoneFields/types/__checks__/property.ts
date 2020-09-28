import {
  RecordNumber,
  Creator,
  CreatedTime,
  Modifier,
  UpdatedTime,
  Category,
  Status,
  StatusAssignee,
  SingleLineText,
  Number,
  Calc,
  MultiLineText,
  RichText,
  Link,
  CheckBox,
  RadioButton,
  Dropdown,
  MultiSelect,
  File,
  Date,
  Time,
  DateTime,
  UserSelect,
  OrganizationSelect,
  GroupSelect,
  Group,
  ReferenceTable,
  Lookup,
  Subtable,
} from "../property";

type Test_SubtableFieldProperty_OK = Subtable<{
  SingleLineText: SingleLineText;
  Number: Number; // eslint-disable-line
  Calc: Calc;
  MultiLineText: MultiLineText;
  RichText: RichText;
  Link: Link;
  CheckBox: CheckBox;
  RadioButton: RadioButton;
  Dropdown: Dropdown;
  MultiSelect: MultiSelect;
  File: File;
  Date: Date;
  Time: Time;
  DateTime: DateTime;
  UserSelect: UserSelect;
  OrganizationSelect: OrganizationSelect;
  GroupSelect: GroupSelect;
  Lookup: Lookup;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_RecordNumber = Subtable<{
  RecordNumber: RecordNumber;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_Creator = Subtable<{
  Creator: Creator;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_CreatedTime = Subtable<{
  CreatedTime: CreatedTime;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_Modifier = Subtable<{
  Modifier: Modifier;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_UpdatedTime = Subtable<{
  UpdatedTime: UpdatedTime;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_Category = Subtable<{
  Category: Category;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_Status = Subtable<{
  Status: Status;
}>;
// @ts-expect-error
type Test_SubtableFieldProperty_NG_StatusAssignee = Subtable<{
  StatusAssignee: StatusAssignee;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_Group = Subtable<{
  Group: Group;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_ReferenceTable = Subtable<{
  ReferenceTable: ReferenceTable;
}>;

// @ts-expect-error
type Test_SubtableFieldProperty_NG_Subtable = Subtable<{
  Subtable: Test_SubtableFieldProperty_OK;
}>;
