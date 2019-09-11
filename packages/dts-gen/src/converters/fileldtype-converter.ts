/* eslint-disable no-unused-vars */
import {
    FieldType,
    SubTableFieldType,
} from "../kintone/clients/forms-client";
/* eslint-enable no-unused-vars */
import { objectValues } from "../utils/objectvalues";

type FieldTypesOrSubTableFieldTypes =
    | FieldType[]
    | SubTableFieldType[];

const SIMPLE_VALUE_TYPES = [
    "SINGLE_LINE_TEXT",
    "MULTI_LINE_TEXT",
    "RICH_TEXT",
    "DATE",
    "NUMBER",
    "DATETIME",
    "TIME",
    "DROP_DOWN",
    "LINK",
    "RADIO_BUTTON",
];

const CALCULATED_VALUE_TYPES = ["CALC"];

const SIMPLE_VALUE_IN_SAVED_RECORD = [
    "RECORD_NUMBER",
    "CREATED_TIME",
    "UPDATED_TIME",
];

const USER_TYPES_IN_SAVED_RECORD = ["CREATOR", "MODIFIER"];

const STRING_LIST_TYPES = ["CHECK_BOX", "MULTI_SELECT"];

const ENTITY_LIST_TYPE = [
    "USER_SELECT",
    "GROUP_SELECT",
    "ORGANIZATION_SELECT",
];

const FILE_TYPE = "FILE";

const SUB_TABLE_TYPE = "SUBTABLE";

export interface FieldTypeGroups {
    stringFields: FieldType[];
    calculatedFields: FieldType[];
    stringFieldsInSavedRecord: FieldType[];
    userFieldsInSavedRecord: FieldType[];
    stringListFields: FieldType[];
    entityListFields: FieldType[];
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
                objectValues(subTableField.fields)
            ),
        };
    });
}

function convertFieldTypesToFieldTypeGroups(
    properties: FieldTypesOrSubTableFieldTypes
): FieldTypeGroups {
    const fieldTypes = objectValues(properties);
    const stringFields = selectFieldsTypesIn(
        SIMPLE_VALUE_TYPES,
        fieldTypes
    );
    const calculatedFields = selectFieldsTypesIn(
        CALCULATED_VALUE_TYPES,
        fieldTypes
    );
    const stringFieldsInSavedRecord = selectFieldsTypesIn(
        SIMPLE_VALUE_IN_SAVED_RECORD,
        fieldTypes
    );
    const userFieldsInSavedRecord = selectFieldsTypesIn(
        USER_TYPES_IN_SAVED_RECORD,
        fieldTypes
    );
    const stringListFields = selectFieldsTypesIn(
        STRING_LIST_TYPES,
        fieldTypes
    );
    const entityListFields = selectFieldsTypesIn(
        ENTITY_LIST_TYPE,
        fieldTypes
    );
    const fileTypeFields = selectFieldsTypesEquals(
        FILE_TYPE,
        fieldTypes
    );
    const subTableFields = convertSubTableFields(
        selectFieldsTypesEquals(
            SUB_TABLE_TYPE,
            fieldTypes
        ) as SubTableFieldType[]
    );

    return {
        stringFields,
        calculatedFields,
        stringFieldsInSavedRecord,
        entityListFields,
        userFieldsInSavedRecord,
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
