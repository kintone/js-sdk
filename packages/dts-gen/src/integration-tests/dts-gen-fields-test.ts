// eslint-disable-next-line @typescript-eslint/triple-slash-reference, spaced-comment
/// <reference path="./testfields.d.ts" />
import * as assert from "assert";
type SavedTestFields = kintone.types.SavedFields;

const assertFieldTypes = (record: SavedTestFields) => {
  // Assert simple field types
  [
    {
      ref: record.$id,
      type: "__ID__",
    },
    {
      ref: record.$revision,
      type: "__REVISION__",
    },
    {
      ref: record.Record_number,
      type: "RECORD_NUMBER",
    },
    {
      ref: record.Updated_datetime,
      type: "UPDATED_TIME",
    },
    {
      ref: record.Created_datetime,
      type: "CREATED_TIME",
    },
    {
      ref: record.Text,
      type: "SINGLE_LINE_TEXT",
    },
    {
      ref: record.Rich_text,
      type: "RICH_TEXT",
    },
    {
      ref: record.Text_area,
      type: "MULTI_LINE_TEXT",
    },
    {
      ref: record.Number,
      type: "NUMBER",
    },
    {
      ref: record.Calculated,
      type: "CALC",
    },
    {
      ref: record.Radio_button,
      type: "RADIO_BUTTON",
    },
    {
      ref: record.Drop_down,
      type: "DROP_DOWN",
    },
    {
      ref: record.Date,
      type: "DATE",
    },
    {
      ref: record.Time,
      type: "TIME",
    },
    {
      ref: record.Date_and_time,
      type: "DATETIME",
    },
    {
      ref: record.Link,
      type: "LINK",
    },
  ].forEach(({ ref, type }) => assertSimpleField(ref, type));

  // Assert string list field types
  [
    {
      ref: record.Check_box,
      type: "CHECK_BOX",
    },
    {
      ref: record.Multi_choice,
      type: "MULTI_SELECT",
    },
  ].forEach(({ ref, type }) => assertStringListField(ref, type));
  // assert entity
  [
    {
      ref: record.Updated_by,
      type: "MODIFIER",
    },
    {
      ref: record.Created_by,
      type: "CREATOR",
    },
  ].forEach(({ ref, type }) => assertEntity(ref, type));

  // assert entity list field types
  [
    {
      ref: record.User_selection,
      type: "USER_SELECT",
    },
    {
      ref: record.Department_selection,
      type: "ORGANIZATION_SELECT",
    },
    {
      ref: record.Group_selection,
      type: "GROUP_SELECT",
    },
  ].forEach(({ ref, type }) => {
    assertEntityListField(ref, type);
  });

  assertType(record.Attachment.type, "FILE");
  assert.ok(record.Attachment.value.length);
  assertFileField(record.Attachment);

  [
    {
      ref: record.Table,
    },
    {
      ref: record.Table_0,
    },
  ].forEach(({ ref }) => assertSubTable(ref));

  const tv = record.Table.value[0].value;
  [
    {
      ref: tv.Calculated_Table,
      type: "CALC",
    },
    {
      ref: tv.Number_Table,
      type: "NUMBER",
    },
    {
      ref: tv.Text_Table,
      type: "SINGLE_LINE_TEXT",
    },
    {
      ref: tv.Rich_text_Table,
      type: "RICH_TEXT",
    },
    {
      ref: tv.Text_area_Table,
      type: "MULTI_LINE_TEXT",
    },
  ].forEach(({ ref, type }) => assertSimpleField(ref, type));
  assert.ok(tv.Calculated_Table.value);
  assert.ok(tv.Number_Table.value);
  assert.ok(tv.Text_Table.value);
  assert.ok(tv.Text_area_Table.value);

  const tv0 = record.Table_0.value[0].value;
  assertFileField(tv0.Attachment_Table);
  [
    {
      ref: tv0.Check_box_Table,
      type: "CHECK_BOX",
    },
    {
      ref: tv0.Date_Table,
      type: "DATE",
    },
    {
      ref: tv0.Date_and_time_Table,
      type: "DATETIME",
    },
    {
      ref: tv0.Link_Table,
      type: "LINK",
    },
    {
      ref: tv0.Time_Table,
      type: "TIME",
    },
  ].forEach(({ ref, type }) => assertSimpleField(ref, type));

  [
    {
      ref: tv0.Check_box_Table,
      type: "CHECK_BOX",
    },
    {
      ref: tv0.Multi_choice_Table,
      type: "MULTI_SELECT",
    },
  ].forEach(({ ref, type }) => assertStringListField(ref, type));
};

const assertSubTable = (ref: { type: string; value: any[] }) => {
  assertType(ref.type, "SUBTABLE");
  assertNotUndefined(ref.value.length);
};

const assertSimpleField = (ref: any, expectedType: string) => {
  assertType(ref.type, expectedType);
  assert.ok(ref.value !== undefined);
};

const assertStringListField = (ref: any, expectedType: string) => {
  assertType(ref.type, expectedType);
  assertNotUndefined(ref.value.length);
};

const assertEntity = (
  ref: {
    type: string;
    value: { code: string; name: string };
  },
  expectedType: string
) => {
  assertType(ref.type, expectedType);
  assertNotUndefined(ref.value);
  assertNotUndefined(ref.value.code);
  assertNotUndefined(ref.value.name);
};

const assertEntityListField = (ref: any, expectedType: string) => {
  assertType(ref.type, expectedType);
  assertNotUndefined(ref.value.length);
  assertNotUndefined(ref.value[0].code);
  assertNotUndefined(ref.value[0].name);
};

const assertType = (type, expectedType) => {
  assert.strictEqual(
    type,
    expectedType,
    `expected: ${expectedType}, actual:${type}`
  );
};

const assertNotUndefined = (ref) => {
  assert.ok(ref !== undefined);
};

interface FileFieldValue {
  type: "FILE";
  value: Array<{
    name: string;
    contentType: string;
    fileKey: string;
  }>;
}
const assertFileField = (ref: FileFieldValue) => {
  assert.ok(ref.type, "FILE");
  assert.ok(ref.value.length);
  assert.ok(ref.value[0].name);
  assert.ok(ref.value[0].contentType);
  assert.ok(ref.value[0].fileKey);
};

export const DTSGenFieldsTest = {
  assertFieldTypes,
};
