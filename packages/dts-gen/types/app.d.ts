import {kintone} from "@kintone/dts-gen/kintone-comture" 
export declare namespace comture {
  interface test {
    Time: kintone.fieldTypes.Time;
    Radio_button: kintone.fieldTypes.RadioButton;
    Number: kintone.fieldTypes.Number;
    Drop_down: kintone.fieldTypes.DropDown;
    Rich_text: kintone.fieldTypes.RichText;
    Text: kintone.fieldTypes.SingleLineText;
    Text_area: kintone.fieldTypes.MultiLineText;
    Date: kintone.fieldTypes.Date;
    Date_and_time: kintone.fieldTypes.DateTime;
    Link: kintone.fieldTypes.Link;
    Calculated: kintone.fieldTypes.Calc;
    Check_box: kintone.fieldTypes.CheckBox;
    Multi_choice: kintone.fieldTypes.MultiSelect;
    Group_selection: kintone.fieldTypes.GroupSelect;
    User_selection: kintone.fieldTypes.UserSelect;
    Department_selection: kintone.fieldTypes.OrganizationSelect;
    Attachment: kintone.fieldTypes.File;
    Table: {
      type: "SUBTABLE";
      value: Array<{
        id: string;
        value: {
          Rich_text_Table: kintone.fieldTypes.RichText;
          Number_Table: kintone.fieldTypes.Number;
          Text_Table: kintone.fieldTypes.SingleLineText;
          Text_area_Table: kintone.fieldTypes.MultiLineText;
          Calculated_Table: kintone.fieldTypes.Calc;
        };
      }>;
    };
    Table_0: {
      type: "SUBTABLE";
      value: Array<{
        id: string;
        value: {
          Drop_down_Table: kintone.fieldTypes.DropDown;
          Radio_button_Table: kintone.fieldTypes.RadioButton;
          Time_Table: kintone.fieldTypes.Time;
          Date_Table: kintone.fieldTypes.Date;
          Link_Table: kintone.fieldTypes.Link;
          Date_and_time_Table: kintone.fieldTypes.DateTime;

          Check_box_Table: kintone.fieldTypes.CheckBox;
          Multi_choice_Table: kintone.fieldTypes.MultiSelect;

          Attachment_Table: kintone.fieldTypes.File;
        };
      }>;
    };
  }
  interface Savedtest extends test {
    $id: kintone.fieldTypes.Id;
    $revision: kintone.fieldTypes.Revision;
    Updated_by: kintone.fieldTypes.Modifier;
    Created_by: kintone.fieldTypes.Creator;
    Created_datetime: kintone.fieldTypes.CreatedTime;
    Record_number: kintone.fieldTypes.RecordNumber;
    Updated_datetime: kintone.fieldTypes.UpdatedTime;
  }
}
