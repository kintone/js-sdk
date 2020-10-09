import { Field, Row, Subtable, Group } from "../layout";

type Test_RowLayout_OK = Row<
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

type Test_SubtableLayout_OK = Subtable<
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

type Test_SubtableLayout_NG_RecordNumber = Subtable<
  // @ts-expect-error
  [Field.RecordNumber]
>;

type Test_SubtableLayout_NG_Creator = Subtable<
  // @ts-expect-error
  [Field.Creator]
>;

type Test_SubtableLayout_NG_CreatedTime = Subtable<
  // @ts-expect-error
  [Field.CreatedTime]
>;

type Test_SubtableLayout_NG_Modifier = Subtable<
  // @ts-expect-error
  [Field.Modifier]
>;

type Test_SubtableLayout_NG_UpdatedTime = Subtable<
  // @ts-expect-error
  [Field.UpdatedTime]
>;

type Test_SubtableLayout_NG_ReferenceTable = Subtable<
  // @ts-expect-error
  [Field.ReferenceTable]
>;

type Test_SubtableLayout_NG_Label = Subtable<
  // @ts-expect-error
  [Field.Label]
>;

type Test_SubtableLayout_NG_HR = Subtable<
  // @ts-expect-error
  [Field.HR]
>;

type Test_SubtableLayout_NG_Spacer = Subtable<
  // @ts-expect-error
  [Field.Spacer]
>;

type Test_GroupLayout_OK = Group<[Test_RowLayout_OK]>;

type Test_GroupLayout_NG_Subtable = Group<
  // @ts-expect-error
  [Test_SubtableLayout_OK]
>;

type Test_GroupLayout_NG_Group = Group<
  // @ts-expect-error
  [Test_GroupLayout_OK]
>;
