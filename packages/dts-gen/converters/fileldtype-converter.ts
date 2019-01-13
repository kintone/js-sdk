import {FieldType, SubTableFieldType} from '../kintone/clients/forms-client';

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
    "LINK"
];

const USER_TYPES = [
    "CREATOR",
    "MODIFIER"
];

const STRING_LIST_TYPES = [
    "CHECK_BOX",
    "MULTI_SELECT",
];

const USER_SELECT_TYPE = "USER_SELECT";

const FILE_TYPE = "FILE";

const SUB_TABLE_TYPE = "SUBTABLE";

export interface FieldTypeGroups {
    simpleFields : FieldType[]
    userFields :  FieldType[]
    stringListFields  : FieldType[]
    userListFields : FieldType[],
    fileTypeFields : FieldType[]
    subTableFields : {[key:string]:FieldType[]}
}

function selectFieldsTypesIn(types: string[], codeAndFieldType: {[key:string]: FieldType|SubTableFieldType}): FieldType[] {
    const fields = [];
    Object
        .keys(codeAndFieldType)
        .filter(key => types.indexOf(codeAndFieldType[key].type) >= 0)
        .forEach(key => fields.push(codeAndFieldType[key]));

    return fields;
}

function selectFieldsTypesEquals(type: string, codeAndFieldType:  {[key:string]:FieldType|SubTableFieldType}) : FieldType[] {
    const fields = [];
    Object
        .keys(codeAndFieldType)
        .filter(key => codeAndFieldType[key].type === type)
        .forEach(key => fields.push(codeAndFieldType[key]));

    return fields;
}

function convertSubTableFields(subTableFields: SubTableFieldType[]) : {[key: string]:FieldType[]} {
    const fieldAndFieldTypes = {};   
     subTableFields
        .map(field => {
            const fields = field.fields as {[key:string]:FieldType};
            return {code: field.code, fields: convertFieldTypesToFieldTypeGroups(fields)}
        })
        .forEach(({code, fields}) => fieldAndFieldTypes[code] = fields);
        return fieldAndFieldTypes;
}

function convertFieldTypesToFieldTypeGroups(properties: {[key: string]:FieldType|SubTableFieldType}) : FieldTypeGroups {
    const simpleFields = selectFieldsTypesIn(SIMPLE_VALUE_TYPES, properties);
    const userFields = selectFieldsTypesIn(USER_TYPES, properties);
    const stringListFields = selectFieldsTypesIn(STRING_LIST_TYPES, properties);
    const userListFields = selectFieldsTypesEquals(USER_SELECT_TYPE, properties);
    const fileTypeFields = selectFieldsTypesEquals(FILE_TYPE, properties);
    const subTableFields = convertSubTableFields(selectFieldsTypesEquals(SUB_TABLE_TYPE, properties) as SubTableFieldType[]);

    return {
        simpleFields,
        userListFields,
        userFields,
        stringListFields,
        fileTypeFields,
        subTableFields,
    }
}

export const FieldTypeConverter = {
    convertFieldTypesToFieldTypeGroups
};