import { VisibleForTesting } from "./fileldtype-converter";
import { SubTableFieldType } from "../kintone/clients/forms-client";

describe("FileFieldTypeConverter", () => {
    const input = {
        userSelect: {
            type: "USER_SELECT",
            code: "userSelect",
        },
        userSelect2: {
            type: "USER_SELECT",
            code: "userSelect2",
        },
        singleLineText: {
            type: "SINGLE_LINE_TEXT",
            code: "singleLineText",
        },
        multiLineText: {
            type: "MULTI_LINE_TEXT",
            code: "multiLineText",
        },
        richText: {
            type: "RICH_TEXT",
            code: "richText",
        },
        date: {
            type: "DATE",
            code: "date",
        },
        time: {
            type: "TIME",
            code: "time",
        },
        createdTime: {
            type: "CREATED_TIME",
            code: "createdTime",
        },
        updatedTime: {
            type: "UPDATED_TIME",
            code: "updatedTime",
        },
        recordNumber: {
            type: "RECORD_NUMBER",
            code: "recordNumber",
        },
        dropDown: {
            type: "DROP_DOWN",
            code: "dropDown",
        },
        link: {
            type: "LINK",
            code: "link",
        },
        number: {
            type: "NUMBER",
            code: "number",
        },
        file: {
            type: "FILE",
            code: "file",
        },
        checkbox: {
            type: "CHECK_BOX",
            code: "checkbox",
        },
        multiSelect: {
            type: "MULTI_SELECT",
            code: "multiSelect",
        },
        creator: {
            type: "CREATOR",
            code: "creator",
        },
        modifier: {
            type: "MODIFIER",
            code: "modifier",
        },
    };

    test("selectFieldsTypesEquals returns lists of values which is selected if fieldType is same", () => {
        const type =
            VisibleForTesting.constants.USER_SELECT_TYPE;
        const output = VisibleForTesting.selectFieldsTypesEquals(
            type,
            input
        );
        const expected = [
            {
                type: "USER_SELECT",
                code: "userSelect",
            },
            {
                type: "USER_SELECT",
                code: "userSelect2",
            },
        ];
        expect(output).toEqual(expected);
    });

    test("selectFieldsTypesIn returns list of values which is selected if fieldType was contained in condition.", () => {
        const types =
            VisibleForTesting.constants.STRING_LIST_TYPES;
        const output = VisibleForTesting.selectFieldsTypesIn(
            types,
            input
        );
        const expected = [
            {
                code: "checkbox",
                type: "CHECK_BOX",
            },
            {
                code: "multiSelect",
                type: "MULTI_SELECT",
            },
        ];
        expect(output).toEqual(expected);
    });

    test("", () => {
        const subTables = [
            {
                type: "SUBTABLE",
                code: "subTable",
                fields: input,
            },
        ] as SubTableFieldType[];
        const output = VisibleForTesting.convertSubTableFields(
            subTables
        );
        expect(Object.keys(output)).toEqual(["subTable"]);

        const expectedSimpleFields = [
            {
                code: "singleLineText",
                type: "SINGLE_LINE_TEXT",
            },
            {
                code: "multiLineText",
                type: "MULTI_LINE_TEXT",
            },
            {
                code: "richText",
                type: "RICH_TEXT",
            },
            {
                code: "date",
                type: "DATE",
            },
            {
                code: "time",
                type: "TIME",
            },
            {
                code: "createdTime",
                type: "CREATED_TIME",
            },
            {
                code: "updatedTime",
                type: "UPDATED_TIME",
            },
            {
                code: "recordNumber",
                type: "RECORD_NUMBER",
            },
            {
                code: "dropDown",
                type: "DROP_DOWN",
            },
            {
                code: "link",
                type: "LINK",
            },
            {
                code: "number",
                type: "NUMBER",
            },
        ];
        expect(output.subTable.simpleFields).toEqual(
            expectedSimpleFields
        );

        const expectedFieldFields = [
            {
                code: "file",
                type: "FILE",
            },
        ];
        expect(output.subTable.fileTypeFields).toEqual(
            expectedFieldFields
        );

        const expectedStringListFields = [
            {
                code: "checkbox",
                type: "CHECK_BOX",
            },
            {
                code: "multiSelect",
                type: "MULTI_SELECT",
            },
        ];
        expect(output.subTable.stringListFields).toEqual(
            expectedStringListFields
        );

        const expectedUserFields = [
            {
                code: "creator",
                type: "CREATOR",
            },
            {
                code: "modifier",
                type: "MODIFIER",
            },
        ];
        expect(output.subTable.userFields).toEqual(
            expectedUserFields
        );
        expect(output.subTable.subTableFields).toEqual({});
    });
});
