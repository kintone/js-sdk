import {
    FieldType,
    FieldTypesOrSubTableFieldTypes,
    SubTableFieldType,
} from "../kintone/clients/forms-client";

const SIMPLE_VALUE_TYPES = [
    "SINGLE_LINE_TEXT",
    "MULTI_LINE_TEXT",
    "RICH_TEXT",
    "DATE",
    "NUMBER",
    "DATETIME",
    "TIME",
    "CREATED_TIME",
    "UPDATED_TIME",
    "RECORD_NUMBER",
    "DROP_DOWN",
    "LINK",
    "CALC",
    "RADIO_BUTTON",
];

const USER_TYPES = ["CREATOR", "MODIFIER"];

const STRING_LIST_TYPES = ["CHECK_BOX", "MULTI_SELECT"];

const ENTITY_LIST_TYPE = [
    "USER_SELECT",
    "GROUP_SELECT",
    "ORGANIZATION_SELECT",
];

const FILE_TYPE = "FILE";

const SUB_TABLE_TYPE = "SUBTABLE";

export interface FieldTypeGroups {
    simpleFields: FieldType[];
    userFields: FieldType[];
    stringListFields: FieldType[];
    userListFields: FieldType[];
    fileTypeFields: FieldType[];
    subTableFields: SubTableFieldTypeGroups[];
}

interface SubTableFieldTypeGroups {
    code: string;
    type: string;
    fields: FieldTypeGroups;
}

function excludeLookupOrRelatedRecord(
    field: FieldType | SubTableFieldType
) {
    return Object.keys(field).indexOf("relatedApp") < 0;
}

function selectFieldsTypesIn(
    types: string[],
    fieldsToBeSelected: FieldTypesOrSubTableFieldTypes
): FieldTypesOrSubTableFieldTypes {
    const fields = fieldsToBeSelected as Array<
        FieldType | SubTableFieldType
    >;
    const typeIncludes = fieldToTest =>
        types.indexOf(fieldToTest.type) >= 0;

    return fields
        .filter(typeIncludes)
        .filter(excludeLookupOrRelatedRecord);
}

function selectFieldsTypesEquals(
    type: string,
    fieldsToBeSelected: FieldTypesOrSubTableFieldTypes
): FieldTypesOrSubTableFieldTypes {
    const fields = fieldsToBeSelected as Array<
        FieldType | SubTableFieldType
    >;

    return fields
        .filter(field => field.type === type)
        .filter(excludeLookupOrRelatedRecord);
}

function convertSubTableFields(
    subTableFields: SubTableFieldType[]
): SubTableFieldTypeGroups[] {
    return subTableFields.map(subTableField => {
        return {
            code: subTableField.code,
            type: subTableField.type,
            fields: convertFieldTypesToFieldTypeGroups(
                subTableField.fields
            ),
        };
    });
}

function convertFieldTypesToFieldTypeGroups(
    properties: FieldTypesOrSubTableFieldTypes
): FieldTypeGroups {
    const simpleFields = selectFieldsTypesIn(
        SIMPLE_VALUE_TYPES,
        properties
    );
    const userFields = selectFieldsTypesIn(
        USER_TYPES,
        properties
    );
    const stringListFields = selectFieldsTypesIn(
        STRING_LIST_TYPES,
        properties
    );
    const userListFields = selectFieldsTypesIn(
        ENTITY_LIST_TYPE,
        properties
    );
    const fileTypeFields = selectFieldsTypesEquals(
        FILE_TYPE,
        properties
    );
    const subTableFields = convertSubTableFields(
        selectFieldsTypesEquals(
            SUB_TABLE_TYPE,
            properties
        ) as SubTableFieldType[]
    );

    return {
        simpleFields,
        userListFields,
        userFields,
        stringListFields,
        fileTypeFields,
        subTableFields,
    };
}

export const FieldTypeConverter = {
    convertFieldTypesToFieldTypeGroups,
};

export const VisibleForTesting = {
    selectFieldsTypesIn,
    selectFieldsTypesEquals,
    convertSubTableFields,
    constants: {
        STRING_LIST_TYPES,
        FILE_TYPE,
    },
};
