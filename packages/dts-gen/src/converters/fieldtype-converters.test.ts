import { VisibleForTesting } from "./fileldtype-converter";
// eslint-disable-next-line no-unused-vars
import { SubTableFieldType } from "../kintone/clients/forms-client";
import { objectValues } from "../utils/objectvalues";

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
        // Lookup field and Related App record should be excluded
        relatedApp: {
            type: "FILE",
            code: "relatedApp",
            relatedApp: "12",
        },
        lookupApp: {
            type: "CHECK_BOX",
            code: "lookupApp",
            relatedApp: "13",
        },
    };

    test("selectFieldsTypesEquals returns lists of values which is selected if fieldType is same", () => {
        const type = VisibleForTesting.constants.FILE_TYPE;
        const output = VisibleForTesting.selectFieldsTypesEquals(
            type,
            objectValues(input)
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
            objectValues(input)
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

    test("convertSubTableFields", () => {
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
        expect(output[0].fields.stringFields).toEqual(
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
        expect(
            output[0].fields.userFieldsInSavedRecord
        ).toEqual(expectedUserFields);

        const expectedSimpleValueInSavedRecord = [
            {
                code: "createdTime",
                type: "CREATED_TIME",
            },
            {
                code: "updatedTime",
                type: "UPDATED_TIME",
            },
        ];
        expect(
            output[0].fields.stringFieldsInSavedRecord
        ).toEqual(expectedSimpleValueInSavedRecord);

        expect(output[0].fields.subTableFields).toEqual([]);
    });
});
