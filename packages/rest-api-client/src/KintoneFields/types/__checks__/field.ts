import {
  Subtable,
  ID,
  Revision,
  RecordNumber,
  Creator,
  CreatedTime,
  Modifier,
  UpdatedTime,
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
  Category,
  Status,
  StatusAssignee,
} from "../field";

type Test_SubtableField_OK = Subtable<{
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
}>;

// @ts-expect-error
type Test_SubtableField_NG_ID = Subtable<{ $id: ID }>;

// @ts-expect-error
type Test_SubtableField_NG_Revision = Subtable<{
  $revision: Revision;
}>;

// @ts-expect-error
type Test_SubtableField_NG_RecordNumber = Subtable<{
  RecordNumber: RecordNumber;
}>;

// @ts-expect-error
type Test_SubtableField_NG_Creator = Subtable<{ Creator: Creator }>;

// @ts-expect-error
type Test_SubtableField_NG_CreatedTime = Subtable<{
  CreatedTime: CreatedTime;
}>;

// @ts-expect-error
type Test_SubtableField_NG_Modifier = Subtable<{
  Modifier: Modifier;
}>;

// @ts-expect-error
type Test_SubtableField_NG_UpdatedTime = Subtable<{
  UpdatedTime: UpdatedTime;
}>;

// @ts-expect-error
type Test_SubtableField_NG_Category = Subtable<{
  Category: Category;
}>;

// @ts-expect-error
type Test_SubtableField_NG_Status = Subtable<{ Status: Status }>;

// @ts-expect-error
type Test_SubtableField_NG_StatusAssignee = Subtable<{
  StatusAssignee: StatusAssignee;
}>;

// @ts-expect-error
type Test_SubtableField_NG_Subtable = Subtable<{
  Subtable: Test_SubtableField_OK;
}>;
