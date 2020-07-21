declare namespace kintone.types {
    interface Fields {
        Text: kintone.fieldTypes.SingleLineText;
        Rich_text: kintone.fieldTypes.RichText;
        Text_area: kintone.fieldTypes.MultiLineText;
        Number: kintone.fieldTypes.Number;
        Radio_button: kintone.fieldTypes.RadioButton;
        Drop_down: kintone.fieldTypes.DropDown;
        Date: kintone.fieldTypes.Date;
        Time: kintone.fieldTypes.Time;
        Date_and_time: kintone.fieldTypes.DateTime;
        Link: kintone.fieldTypes.Link;
        Calculated: kintone.fieldTypes.Calc;
        Check_box: kintone.fieldTypes.CheckBox;
        Multi_choice: kintone.fieldTypes.MultiSelect;
        User_selection: kintone.fieldTypes.UserSelect;
        Department_selection: kintone.fieldTypes.OrganizationSelect;
        Group_selection: kintone.fieldTypes.GroupSelect;
        Attachment: kintone.fieldTypes.File;
        Table: {
            type: "SUBTABLE";
            value: {
                id: string;
                value: {
                    Text_Table: kintone.fieldTypes.SingleLineText;
                    Rich_text_Table: kintone.fieldTypes.RichText;
                    Text_area_Table: kintone.fieldTypes.MultiLineText;
                    Number_Table: kintone.fieldTypes.Number;
                    Calculated_Table: kintone.fieldTypes.Calc;
                };
            }[];
        };
        Table_0: {
            type: "SUBTABLE";
            value: {
                id: string;
                value: {
                    Radio_button_Table: kintone.fieldTypes.RadioButton;
                    Drop_down_Table: kintone.fieldTypes.DropDown;
                    Date_Table: kintone.fieldTypes.Date;
                    Time_Table: kintone.fieldTypes.Time;
                    Date_and_time_Table: kintone.fieldTypes.DateTime;
                    Link_Table: kintone.fieldTypes.Link;

                    Check_box_Table: kintone.fieldTypes.CheckBox;
                    Multi_choice_Table: kintone.fieldTypes.MultiSelect;

                    Attachment_Table: kintone.fieldTypes.File;
                };
            }[];
        };
    }
    interface SavedFields extends Fields {
        $id: kintone.fieldTypes.Id;
        $revision: kintone.fieldTypes.Revision;
        Updated_by: kintone.fieldTypes.Modifier;
        Created_by: kintone.fieldTypes.Creator;
        Record_number: kintone.fieldTypes.RecordNumber;
        Updated_datetime: kintone.fieldTypes.UpdatedTime;
        Created_datetime: kintone.fieldTypes.CreatedTime;
    }
}
