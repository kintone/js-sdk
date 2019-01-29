/**
 * This type definition is auto-generated.
 * If you update kintone form settings, Please regenerate this type definition
 */
declare namespace kintone.types {
    interface TestFields {
        Record_number: {
            type: "RECORD_NUMBER";
            value: string;
        };

        Text: {
            type: "SINGLE_LINE_TEXT";
            value: string;
        };

        Rich_text: {
            type: "RICH_TEXT";
            value: string;
        };

        Text_area: {
            type: "MULTI_LINE_TEXT";
            value: string;
        };

        Number: {
            type: "NUMBER";
            value: string;
        };

        Calculated: {
            type: "CALC";
            value: string;
        };

        Radio_button: {
            type: "RADIO_BUTTON";
            value: string;
        };

        Drop_down: {
            type: "DROP_DOWN";
            value: string;
        };

        Date: {
            type: "DATE";
            value: string;
        };

        Time: {
            type: "TIME";
            value: string;
        };

        Date_and_time: {
            type: "DATETIME";
            value: string;
        };

        Link: {
            type: "LINK";
            value: string;
        };

        Check_box: {
            type: "CHECK_BOX";
            value: string[];
        };

        Multi_choice: {
            type: "MULTI_SELECT";
            value: string[];
        };

        User_selection: {
            type: "USER_SELECT";
            value: { code: string; name: string }[];
        };

        Department_selection: {
            type: "ORGANIZATION_SELECT";
            value: { code: string; name: string }[];
        };

        Group_selection: {
            type: "GROUP_SELECT";
            value: { code: string; name: string }[];
        };

        Attachment: {
            type: "FILE";
            value: {
                contentType: string;
                fileKey: string;
                name: string;
                size: string;
            }[];
        };

        Table: {
            type: "SUBTABLE";
            value: {
                id: string;
                value: {
                    Text_Table: {
                        type: "SINGLE_LINE_TEXT";
                        value: string;
                    };

                    Rich_text_Table: {
                        type: "RICH_TEXT";
                        value: string;
                    };

                    Text_area_Table: {
                        type: "MULTI_LINE_TEXT";
                        value: string;
                    };

                    Number_Table: {
                        type: "NUMBER";
                        value: string;
                    };

                    Calculated_Table: {
                        type: "CALC";
                        value: string;
                    };
                };
            }[];
        };

        Table_0: {
            type: "SUBTABLE";
            value: {
                id: string;
                value: {
                    Radio_button_Table: {
                        type: "RADIO_BUTTON";
                        value: string;
                    };

                    Drop_down_Table: {
                        type: "DROP_DOWN";
                        value: string;
                    };

                    Date_Table: {
                        type: "DATE";
                        value: string;
                    };

                    Time_Table: {
                        type: "TIME";
                        value: string;
                    };

                    Date_and_time_Table: {
                        type: "DATETIME";
                        value: string;
                    };

                    Link_Table: {
                        type: "LINK";
                        value: string;
                    };

                    Check_box_Table: {
                        type: "CHECK_BOX";
                        value: string[];
                    };

                    Multi_choice_Table: {
                        type: "MULTI_SELECT";
                        value: string[];
                    };

                    Attachment_Table: {
                        type: "FILE";
                        value: {
                            contentType: string;
                            fileKey: string;
                            name: string;
                            size: string;
                        }[];
                    };
                };
            }[];
        };
    }

    interface SavedTestFields extends TestFields {
        $id: {
            type: "__ID__";
            value: string;
        };
        $revision: {
            type: "__REVISION__";
            value: string;
        };

        Updated_by: {
            type: "MODIFIER";
            value: { code: string; name: string };
        };

        Created_by: {
            type: "CREATOR";
            value: { code: string; name: string };
        };

        Updated_datetime: {
            type: "UPDATED_TIME";
            value: string;
        };

        Created_datetime: {
            type: "CREATED_TIME";
            value: string;
        };
    }
}
