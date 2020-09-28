import { Field, RowLayout, SubtableLayout, GroupLayout } from "../layout";

type Test_RowLayout_OK = RowLayout<
  [
    Field.RecordNumber,
    Field.Creator,
    Field.CreatedTime,
    Field.Modifier,
    Field.UpdatedTime,
    Field.SingleLineText,
    Field.Number,
    Field.Calc,
    Field.MultiLineText,
    Field.RichText,
    Field.Link,
    Field.CheckBox,
    Field.RadioButton,
    Field.Dropdown,
    Field.MultiSelect,
    Field.File,
    Field.Date,
    Field.Time,
    Field.DateTime,
    Field.UserSelect,
    Field.OrganizationSelect,
    Field.GroupSelect,
    Field.ReferenceTable,
    Field.Label,
    Field.HR,
    Field.Spacer
  ]
>;

type Test_SubtableLayout_OK = SubtableLayout<
  [
    Field.SingleLineText,
    Field.Number,
    Field.Calc,
    Field.MultiLineText,
    Field.RichText,
    Field.Link,
    Field.CheckBox,
    Field.RadioButton,
    Field.Dropdown,
    Field.MultiSelect,
    Field.File,
    Field.Date,
    Field.Time,
    Field.DateTime,
    Field.UserSelect,
    Field.OrganizationSelect,
    Field.GroupSelect
  ]
>;

type Test_SubtableLayout_NG_RecordNumber = SubtableLayout<
  // @ts-expect-error
  [Field.RecordNumber]
>;

type Test_SubtableLayout_NG_Creator = SubtableLayout<
  // @ts-expect-error
  [Field.Creator]
>;

type Test_SubtableLayout_NG_CreatedTime = SubtableLayout<
  // @ts-expect-error
  [Field.CreatedTime]
>;

type Test_SubtableLayout_NG_Modifier = SubtableLayout<
  // @ts-expect-error
  [Field.Modifier]
>;

type Test_SubtableLayout_NG_UpdatedTime = SubtableLayout<
  // @ts-expect-error
  [Field.UpdatedTime]
>;

type Test_SubtableLayout_NG_ReferenceTable = SubtableLayout<
  // @ts-expect-error
  [Field.ReferenceTable]
>;

type Test_SubtableLayout_NG_Label = SubtableLayout<
  // @ts-expect-error
  [Field.Label]
>;

type Test_SubtableLayout_NG_HR = SubtableLayout<
  // @ts-expect-error
  [Field.HR]
>;

type Test_SubtableLayout_NG_Spacer = SubtableLayout<
  // @ts-expect-error
  [Field.Spacer]
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
