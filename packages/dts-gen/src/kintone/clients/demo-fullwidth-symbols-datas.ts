const DemoFullWidthSymbolDataFields: any = {
    Nakaguro: {
        type: "SINGLE_LINE_TEXT",
        label: "・",
        noLabel: "false",
        code: "・",
        required: "false",
        expression: "",
        hideExpression: "false",
        unique: "false",
        defaultValue: "",
    },

    FullWidthDollar: {
        type: "SINGLE_LINE_TEXT",
        label: "＄",
        noLabel: "false",
        code: "＄",
        required: "false",
        defaultValue: "",
    },

    FullWidthYen: {
        type: "SINGLE_LINE_TEXT",
        label: "￥",
        noLabel: "false",
        code: "￥",
        required: "false",
        defaultValue: "",
    },

    FullWidthUnderBar: {
        type: "SINGLE_LINE_TEXT",
        label: "＿",
        noLabel: "false",
        code: "＿",
        required: "false",
        defaultValue: "",
    },
};

const DemoFullWidthSymbolRecord: any = {
    Nakaguro: {
        type: "SINGLE_LINE_TEXT",
        value: "・",
    },

    FullWidthDollar: {
        type: "SINGLE_LINE_TEXT",
        value: "＄",
    },

    FullWidthYen: {
        type: "SINGLE_LINE_TEXT",
        value: "￥",
    },

    FullWidthUnderBar: {
        type: "SINGLE_LINE_TEXT",
        value: "＿",
    },
};

const DemoDataBuiltinFields: any = {
    Record_number: {
        type: "RECORD_NUMBER",
        label: "Record number",
        noLabel: "false",
        code: "Record_number",
    },
    Updated_by: {
        type: "MODIFIER",
        label: "Updated by",
        noLabel: "false",
        code: "Updated_by",
    },
    Created_by: {
        type: "CREATOR",
        label: "Created by",
        noLabel: "false",
        code: "Created_by",
    },
    Updated_datetime: {
        type: "UPDATED_TIME",
        label: "Updated datetime",
        noLabel: "false",
        code: "Updated_datetime",
    },
    Created_datetime: {
        type: "CREATED_TIME",
        label: "Created datetime",
        noLabel: "false",
        code: "Created_datetime",
    },
};

export const DemoDatas = {
    DemoFullWidthSymbolDataFields,
    DemoDataIncludingBuiltinFields: Object.assign(
        DemoDataBuiltinFields,
        DemoFullWidthSymbolDataFields
    ),
    DemoFullWidthSymbolRecord,
};
