/// <reference path="./demo-fields.d.ts" />
import * as assert from "assert";

function assertFieldTypes(
    record: kintone.types.SavedDemoFields
) {
    // Assert simple TestField
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
            ref: record.Updated_datetime,
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
}

function assertSimpleField(
    ref: { type: string; value: any },
    expectedType: string
) {
    assertType(ref.type, expectedType);
    assert.ok(ref.value);
}

function assertStringListField(
    ref: { type: string; value: string[] },
    expectedType: string
) {
    assertType(ref.type, expectedType);
    assert.ok(Array.isArray(ref.value));
}

function assertType(type, expectedType) {
    assert.strictEqual(
        type,
        expectedType,
        `expected: ${expectedType}, actual:${type}`
    );
}

export const KintoneTyplifyFieldsTest = {
    assertFieldTypes,
};
