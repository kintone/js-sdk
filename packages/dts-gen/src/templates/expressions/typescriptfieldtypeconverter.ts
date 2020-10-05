const KintoneFieldTypeAndTypeScriptFieldTypeName = {
    SINGLE_LINE_TEXT: "kintone.fieldTypes.SingleLineText",
    MULTI_LINE_TEXT: "kintone.fieldTypes.MultiLineText",
    RICH_TEXT: "kintone.fieldTypes.RichText",
    DATE: "kintone.fieldTypes.Date",
    CALC: "kintone.fieldTypes.Calc",
    FILE: "kintone.fieldTypes.File",
    NUMBER: "kintone.fieldTypes.Number",
    DATETIME: "kintone.fieldTypes.DateTime",
    TIME: "kintone.fieldTypes.Time",
    DROP_DOWN: "kintone.fieldTypes.DropDown",
    LINK: "kintone.fieldTypes.Link",
    RADIO_BUTTON: "kintone.fieldTypes.RadioButton",
    CHECK_BOX: "kintone.fieldTypes.CheckBox",
    MULTI_SELECT: "kintone.fieldTypes.MultiSelect",
    RECORD_NUMBER: "kintone.fieldTypes.RecordNumber",
    CREATED_TIME: "kintone.fieldTypes.CreatedTime",
    UPDATED_TIME: "kintone.fieldTypes.UpdatedTime",
    MODIFIER: "kintone.fieldTypes.Modifier",
    CREATOR: "kintone.fieldTypes.Creator",
    USER_SELECT: "kintone.fieldTypes.UserSelect",
    GROUP_SELECT: "kintone.fieldTypes.GroupSelect",
    ORGANIZATION_SELECT:
        "kintone.fieldTypes.OrganizationSelect",
};

function convert(typeName: string) {
    const typeScriptFieldType =
        KintoneFieldTypeAndTypeScriptFieldTypeName[
            typeName
        ];
    if (!typeScriptFieldType) {
        throw new Error(
            `${typeName} is not mapped to kintone.fieldTypes[TypeName]`
        );
    }
    return typeScriptFieldType;
}

export const Converter = {
    convert,
};
