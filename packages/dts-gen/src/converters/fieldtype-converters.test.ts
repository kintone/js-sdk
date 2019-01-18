import { VisibleForTesting } from "./fileldtype-converter";
import { SubTableFieldType } from "../kintone/clients/forms-client";

describe("FileFieldTypeConverter", () => {
    const input = [
        {
            type: "USER_SELECT",
            code: "userSelect",
        },
        {
            type: "USER_SELECT",
            code: "userSelect2",
        },
        {
            type: "SINGLE_LINE_TEXT",
            code: "singleLineText",
        },
        {
            type: "MULTI_LINE_TEXT",
            code: "multiLineText",
        },
        {
            type: "RICH_TEXT",
            code: "richText",
        },
        {
            type: "DATE",
            code: "date",
        },
        {
            type: "TIME",
            code: "time",
        },
        {
            type: "CREATED_TIME",
            code: "createdTime",
        },
        {
            type: "UPDATED_TIME",
            code: "updatedTime",
        },
        {
            type: "RECORD_NUMBER",
            code: "recordNumber",
        },
        {
            type: "DROP_DOWN",
            code: "dropDown",
        },
        {
            type: "LINK",
            code: "link",
        },
        {
            type: "NUMBER",
            code: "number",
        },
        {
            type: "FILE",
            code: "file",
        },
        {
            type: "CHECK_BOX",
            code: "checkbox",
        },
        {
            type: "MULTI_SELECT",
            code: "multiSelect",
        },
        {
            type: "CREATOR",
            code: "creator",
        },
        {
            type: "MODIFIER",
            code: "modifier",
        },
    ];

    test("selectFieldsTypesEquals returns lists of values which is selected if fieldType is same", () => {
        const type = VisibleForTesting.constants.FILE_TYPE;
        const output = VisibleForTesting.selectFieldsTypesEquals(
            type,
            input
        );
        const expected = [
            {
                type: "FILE",
                code: "file",
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
        expect(output[0].fields.simpleFields).toEqual(
            expectedSimpleFields
        );

        const expectedFieldFields = [
            {
                code: "file",
                type: "FILE",
            },
        ];
        expect(output[0].fields.fileTypeFields).toEqual(
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
        expect(output[0].fields.stringListFields).toEqual(
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
        expect(output[0].fields.userFields).toEqual(
            expectedUserFields
        );
        expect(output[0].fields.subTableFields).toEqual([]);
    });
});
