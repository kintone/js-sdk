/// <reference path="./testfields.d.ts" />
import * as assert from "assert";
type SavedTestFields = kintone.types.SavedTestFields;

function assertFieldTypes(record: SavedTestFields) {
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
    ].forEach(({ ref, type }) =>
        assertSimpleField(ref, type)
    );

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
    ].forEach(({ ref, type }) =>
        assertStringListField(ref, type)
    );
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

    [
        {
            ref: record.Table,
        },
        {
            ref: record.Table_0,
        },
        {
            ref: record.Table_1,
        },
    ].forEach(({ ref }) => assertSubTable(ref));
    assertType(record.Table, "SUBTABLE");
    assertNotUndefined(record.Table.value.length);
    assertType(record.Table_0, "SUBTABLE");
    assertType(record.Table_1, "SUBTABLE");
}

function assertSubTable(ref: {
    type: string;
    value: any[];
}) {
    assertType(ref.type, "SUBTABLE");
    assertNotUndefined(ref.value.length);
}

function assertSimpleField(
    ref: { type: string; value: any },
    expectedType: string
) {
    assertType(ref.type, expectedType);
    assert.ok(ref.value !== undefined);
}

function assertStringListField(
    ref: { type: string; value: string[] },
    expectedType: string
) {
    assertType(ref.type, expectedType);
    assertNotUndefined(ref.value.length);
}

function assertEntity(
    ref: {
        type: string;
        value: { code: string; name: string };
    },
    expectedType: string
) {
    assertType(ref.type, expectedType);
    assertNotUndefined(ref.value);
    assertNotUndefined(ref.value.code);
    assertNotUndefined(ref.value.name);
}

function assertEntityListField(
    ref: {
        type: string;
        value: { code: string; name: string }[];
    },
    expectedType: string
) {
    assertType(ref.type, expectedType);
    assertNotUndefined(ref.value.length);
}

function assertType(type, expectedType) {
    assert.strictEqual(
        type,
        expectedType,
        `expected: ${expectedType}, actual:${type}`
    );
}

function assertNotUndefined(ref) {
    assert.ok(ref !== undefined);
}

export const KintoneTyplifyFieldsTest = {
    assertFieldTypes,
};
