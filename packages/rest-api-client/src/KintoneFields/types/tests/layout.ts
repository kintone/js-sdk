import {
  RecordNumberFieldLayout,
  CreatorFieldLayout,
  CreatedTimeFieldLayout,
  ModifierFieldLayout,
  UpdatedTimeFieldLayout,
  SingleLineTextFieldLayout,
  NumberFieldLayout,
  CalcFieldLayout,
  MultiLineTextFieldLayout,
  RichTextFieldLayout,
  LinkFieldLayout,
  CheckBoxFieldLayout,
  RadioButtonFieldLayout,
  DropdownFieldLayout,
  MultiSelectFieldLayout,
  FileFieldLayout,
  DateFieldLayout,
  TimeFieldLayout,
  DateTimeFieldLayout,
  UserSelectFieldLayout,
  OrganizationSelectFieldLayout,
  GroupSelectFieldLayout,
  ReferenceTableFieldLayout,
  LabelFieldLayout,
  HRFieldLayout,
  SpacerFieldLayout,
  RowLayout,
  SubtableLayout,
  GroupLayout,
} from "../layout";

type Test_RowLayout_OK = RowLayout<
  [
    RecordNumberFieldLayout,
    CreatorFieldLayout,
    CreatedTimeFieldLayout,
    ModifierFieldLayout,
    UpdatedTimeFieldLayout,
    SingleLineTextFieldLayout,
    NumberFieldLayout,
    CalcFieldLayout,
    MultiLineTextFieldLayout,
    RichTextFieldLayout,
    LinkFieldLayout,
    CheckBoxFieldLayout,
    RadioButtonFieldLayout,
    DropdownFieldLayout,
    MultiSelectFieldLayout,
    FileFieldLayout,
    DateFieldLayout,
    TimeFieldLayout,
    DateTimeFieldLayout,
    UserSelectFieldLayout,
    OrganizationSelectFieldLayout,
    GroupSelectFieldLayout,
    ReferenceTableFieldLayout,
    LabelFieldLayout,
    HRFieldLayout,
    SpacerFieldLayout
  ]
>;

type Test_SubtableLayout_OK = SubtableLayout<
  [
    SingleLineTextFieldLayout,
    NumberFieldLayout,
    CalcFieldLayout,
    MultiLineTextFieldLayout,
    RichTextFieldLayout,
    LinkFieldLayout,
    CheckBoxFieldLayout,
    RadioButtonFieldLayout,
    DropdownFieldLayout,
    MultiSelectFieldLayout,
    FileFieldLayout,
    DateFieldLayout,
    TimeFieldLayout,
    DateTimeFieldLayout,
    UserSelectFieldLayout,
    OrganizationSelectFieldLayout,
    GroupSelectFieldLayout
  ]
>;

type Test_SubtableLayout_NG_RecordNumber = SubtableLayout<
  // @ts-expect-error
  [RecordNumberFieldLayout]
>;

type Test_SubtableLayout_NG_Creator = SubtableLayout<
  // @ts-expect-error
  [CreatorFieldLayout]
>;

type Test_SubtableLayout_NG_CreatedTime = SubtableLayout<
  // @ts-expect-error
  [CreatedTimeFieldLayout]
>;

type Test_SubtableLayout_NG_Modifier = SubtableLayout<
  // @ts-expect-error
  [ModifierFieldLayout]
>;

type Test_SubtableLayout_NG_UpdatedTime = SubtableLayout<
  // @ts-expect-error
  [UpdatedTimeFieldLayout]
>;

type Test_SubtableLayout_NG_ReferenceTable = SubtableLayout<
  // @ts-expect-error
  [ReferenceTableFieldLayout]
>;

type Test_SubtableLayout_NG_Label = SubtableLayout<
  // @ts-expect-error
  [LabelFieldLayout]
>;

type Test_SubtableLayout_NG_HR = SubtableLayout<
  // @ts-expect-error
  [HRFieldLayout]
>;

type Test_SubtableLayout_NG_Spacer = SubtableLayout<
  // @ts-expect-error
  [SpacerFieldLayout]
>;

type Test_GroupLayout_OK = GroupLayout<[Test_RowLayout_OK]>;

type Test_GroupLayout_NG_Subtable = GroupLayout<
  // @ts-expect-error
  [Test_SubtableLayout_OK]
>;

type Test_GroupLayout_NG_Group = GroupLayout<
  // @ts-expect-error
  [Test_GroupLayout_OK]
>;
