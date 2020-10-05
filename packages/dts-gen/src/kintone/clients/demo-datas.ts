const DemoDataFields: any = {
    Text: {
        type: "SINGLE_LINE_TEXT",
        label: "Text",
        noLabel: "false",
        code: "Text",
        required: "false",
        minLength: null,
        maxLength: null,
        expression: "",
        hideExpression: "false",
        unique: "false",
        defaultValue: "",
    },

    Rich_text: {
        type: "RICH_TEXT",
        label: "Rich text",
        noLabel: "false",
        code: "Rich_text",
        required: "false",
        defaultValue: "",
    },

    Text_area: {
        type: "MULTI_LINE_TEXT",
        label: "Text area",
        noLabel: "false",
        code: "Text_area",
        required: "false",
        defaultValue: "",
    },

    Number: {
        type: "NUMBER",
        label: "Number",
        noLabel: "false",
        code: "Number",
        required: "false",
        minValue: null,
        maxValue: null,
        digit: "false",
        unique: "false",
        defaultValue: null,
        displayScale: null,
        unit: null,
        unitPosition: "BEFORE",
    },

    Calculated: {
        type: "CALC",
        label: "Calculated",
        noLabel: "false",
        code: "Calculated",
        required: "false",
        expression: "100 + 100",
        format: "NUMBER",
        displayScale: null,
        hideExpression: "false",
        unit: null,
        unitPosition: "BEFORE",
    },

    Radio_button: {
        type: "RADIO_BUTTON",
        code: "Radio_button",
        label: "Radio button",
        noLabel: false,
        required: true,
        options: {
            sample1: {
                label: "sample1",
                index: "0",
            },
            sample2: {
                label: "sample2",
                index: "1",
            },
        },
        defaultValue: "sample1",
        align: "HORIZONTAL",
    },
    Check_box: {
        type: "CHECK_BOX",
        code: "Check_box",
        label: "Check box",
        noLabel: false,
        required: false,
        options: {
            sample1: {
                label: "sample1",
                index: "0",
            },
            sample2: {
                label: "sample2",
                index: "1",
            },
        },
        defaultValue: [],
        align: "HORIZONTAL",
    },

    Multi_choice: {
        type: "MULTI_SELECT",
        code: "Multi_choice",
        label: "Multi choice",
        noLabel: false,
        required: false,
        options: {
            sample1: {
                label: "sample1",
                index: "0",
            },
            sample2: {
                label: "sample2",
                index: "1",
            },
        },
        defaultValue: [],
    },

    Drop_down: {
        type: "DROP_DOWN",
        code: "Drop_down",
        label: "Drop down",
        noLabel: false,
        required: false,
        options: {
            sample1: {
                label: "sample1",
                index: "0",
            },
            sample2: {
                label: "sample2",
                index: "1",
            },
        },
        defaultValue: "",
    },

    Date: {
        type: "DATE",
        label: "Date",
        noLabel: "false",
        code: "Date",
        required: "false",
        unique: "false",
        defaultValue: null,
        defaultExpression: "NOW",
    },

    Time: {
        type: "TIME",
        label: "Time",
        noLabel: "false",
        code: "Time",
        required: "false",
        defaultValue: null,
        defaultExpression: "NOW",
    },
    Date_and_time: {
        type: "DATETIME",
        label: "Date and time",
        noLabel: "false",
        code: "Date_and_time",
        required: "false",
        unique: "false",
        defaultValue: null,
        defaultExpression: "NOW",
    },

    Attachment: {
        type: "FILE",
        label: "Attachment",
        noLabel: "false",
        code: "Attachment",
        required: "false",
    },
    Link: {
        type: "LINK",
        label: "Link",
        noLabel: "false",
        code: "Link",
        required: "false",
        protocol: "MAIL",
        minLength: null,
        maxLength: null,
        unique: "false",
        defaultValue: "",
    },

    User_selection: {
        type: "USER_SELECT",
        label: "User selection",
        noLabel: "false",
        code: "User_selection",
        required: "false",
    },
    Department_selection: {
        type: "ORGANIZATION_SELECT",
        label: "Department selection",
        noLabel: "false",
        code: "Department_selection",
        required: "false",
    },
    Group_selection: {
        type: "GROUP_SELECT",
        label: "Group selection",
        noLabel: "false",
        code: "Group_selection",
        required: "false",
    },

    Table: {
        type: "SUBTABLE",
        code: "Table",
        fields: {
            Text_Table: {
                type: "SINGLE_LINE_TEXT",
                label: "Text",
                noLabel: "false",
                code: "Text_Table",
                required: "false",
                minLength: null,
                maxLength: null,
                expression: "",
                hideExpression: "false",
                unique: "false",
                defaultValue: "",
            },
            Rich_text_Table: {
                type: "RICH_TEXT",
                label: "Rich text",
                noLabel: "false",
                code: "Rich_text_Table",
                required: "false",
                defaultValue: "",
            },
            Text_area_Table: {
                type: "MULTI_LINE_TEXT",
                label: "Text area",
                noLabel: "false",
                code: "Text_area_Table",
                required: "false",
                defaultValue: "",
            },
            Number_Table: {
                type: "NUMBER",
                label: "Number",
                noLabel: "false",
                code: "Number_Table",
                required: "false",
                minValue: null,
                maxValue: null,
                digit: "false",
                unique: "false",
                defaultValue: null,
                displayScale: null,
                unit: null,
                unitPosition: "BEFORE",
            },
            Calculated_Table: {
                type: "CALC",
                label: "Calculated",
                noLabel: "false",
                code: "Calculated_Table",
                required: "false",
                expression: "1 + 1",
                format: "NUMBER",
                displayScale: null,
                hideExpression: "false",
                unit: null,
                unitPosition: "BEFORE",
            },
        },
    },

    Table_0: {
        type: "SUBTABLE",
        code: "Table_0",
        fields: {
            Radio_button_Table: {
                type: "RADIO_BUTTON",
                label: "Radio button",
                noLabel: "false",
                code: "Radio_button_Table",
                required: "true",
                options: {
                    sample1: {
                        label: "sample1",
                        index: "0",
                    },
                    sample2: {
                        label: "sample2",
                        index: "1",
                    },
                },
                defaultValue: "sample1",
            },
            Check_box_Table: {
                type: "CHECK_BOX",
                label: "Check box",
                noLabel: "false",
                code: "Check_box_Table",
                required: "false",
                options: {
                    sample1: {
                        label: "sample1",
                        index: "0",
                    },
                    sample2: {
                        label: "sample2",
                        index: "1",
                    },
                },
                defaultValue: [],
            },
            Multi_choice_Table: {
                type: "MULTI_SELECT",
                label: "Multi-choice",
                noLabel: "false",
                code: "Multi_choice_Table",
                required: "false",
                options: {
                    sample1: {
                        label: "sample1",
                        index: "0",
                    },
                    sample2: {
                        label: "sample2",
                        index: "1",
                    },
                },
                defaultValue: [],
            },
            Drop_down_Table: {
                type: "DROP_DOWN",
                label: "Drop-down",
                noLabel: "false",
                code: "Drop_down_Table",
                required: "false",
                options: {
                    sample1: {
                        label: "sample1",
                        index: "0",
                    },
                    sample2: {
                        label: "sample2",
                        index: "1",
                    },
                },
                defaultValue: null,
            },
            Date_Table: {
                type: "DATE",
                label: "Date",
                noLabel: "false",
                code: "Date_Table",
                required: "false",
                unique: "false",
                defaultValue: null,
                defaultExpression: "NOW",
            },
            Time_Table: {
                type: "TIME",
                label: "Time",
                noLabel: "false",
                code: "Time_Table",
                required: "false",
                defaultValue: null,
                defaultExpression: "NOW",
            },
            Date_and_time_Table: {
                type: "DATETIME",
                label: "Date and time",
                noLabel: "false",
                code: "Date_and_time_Table",
                required: "false",
                unique: "false",
                defaultValue: null,
                defaultExpression: "NOW",
            },
            Attachment_Table: {
                type: "FILE",
                label: "Attachment",
                noLabel: "false",
                code: "Attachment_Table",
                required: "false",
            },
            Link_Table: {
                type: "LINK",
                label: "Link",
                noLabel: "false",
                code: "Link_Table",
                required: "false",
                protocol: "WEB",
                minLength: null,
                maxLength: null,
                unique: "false",
                defaultValue: "",
            },
        },
    },
};

const DemoRecord: any = {
    Text: {
        type: "SINGLE_LINE_TEXT",
        value: "Sample Sample",
    },

    Rich_text: {
        type: "RICH_TEXT",
        value: "<span>Sample Sample</span>",
    },

    Text_area: {
        type: "MULTI_LINE_TEXT",
        value: "Sample\nSample",
    },

    Number: {
        type: "NUMBER",
        value: "1",
    },

    Calculated: {
        type: "CALC",
        value: "",
    },
    Radio_button: {
        type: "RADIO_BUTTON",
        value: "sample1",
    },
    Check_box: {
        type: "CHECK_BOX",
        value: ["sample1", "sample2"],
    },

    Multi_choice: {
        type: "MULTI_SELECT",
        code: "Multi_choice",
        value: ["sample1", "sample2"],
    },

    Drop_down: {
        type: "DROP_DOWN",
        value: "sample1",
    },

    Date: {
        type: "DATE",
        value: "2019-01-31",
    },

    Time: {
        type: "TIME",
        value: "12:31",
    },
    Date_and_time: {
        type: "DATETIME",
        value: "2012-01-11T11:30:00Z",
    },

    Attachment: {
        type: "FILE",
        value: [],
    },
    Link: {
        type: "LINK",
        value: "exmale@example.com",
    },

    User_selection: {
        type: "USER_SELECT",
        value: [],
    },
    Department_selection: {
        type: "ORGANIZATION_SELECT",
        value: [],
    },
    Group_selection: {
        type: "GROUP_SELECT",
        value: [],
    },

    Table: {
        type: "SUBTABLE",
        code: "Table",

        value: [
            {
                value: {
                    Text_Table: {
                        type: "SINGLE_LINE_TEXT",
                        value: "Table Text",
                    },
                    Rich_text_Table: {
                        type: "RICH_TEXT",
                        value: "<div> Table Text</div>",
                    },
                    Text_area_Table: {
                        type: "MULTI_LINE_TEXT",
                        value: "Table\nText",
                    },
                    Number_Table: {
                        type: "NUMBER",
                        value: "1",
                    },
                    Calculated_Table: {
                        type: "CALC",
                        value: null,
                    },
                },
            },
        ],
    },

    Table_0: {
        type: "SUBTABLE",
        code: "Table_0",
        value: [
            {
                value: {
                    Radio_button_Table: {
                        type: "RADIO_BUTTON",
                        value: "sample1",
                    },
                    Check_box_Table: {
                        type: "CHECK_BOX",
                        value: ["sample1", "sample2"],
                    },
                    Multi_choice_Table: {
                        type: "MULTI_SELECT",
                        value: ["sample1", "sample2"],
                    },
                    Drop_down_Table: {
                        type: "DROP_DOWN",
                        value: "sample1",
                    },
                    Date_Table: {
                        type: "DATE",
                        value: "2018-12-01",
                    },
                    Time_Table: {
                        type: "TIME",
                        value: "12:00",
                    },
                    Date_and_time_Table: {
                        type: "DATETIME",
                        value: "2012-01-11T11:30:00Z",
                    },
                    Attachment_Table: {
                        type: "FILE",
                        value: [],
                    },
                    Link_Table: {
                        type: "LINK",
                        value: "https://example.com",
                    },
                },
            },
        ],
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
    DemoDataFields,
    DemoDataIncludingBuiltinFields: Object.assign(
        DemoDataBuiltinFields,
        DemoDataFields
    ),
    DemoRecord,
};
