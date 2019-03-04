declare namespace kintone.types {
  interface TestFields {
    Record_number: {
      type: "RECORD_NUMBER";
      value: string;
      error?: string;
    };
    Text: {
      type: "SINGLE_LINE_TEXT";
      value: string;
      error?: string;
    };
    Rich_text: {
      type: "RICH_TEXT";
      value: string;
      error?: string;
    };
    Text_area: {
      type: "MULTI_LINE_TEXT";
      value: string;
      error?: string;
    };
    Number: {
      type: "NUMBER";
      value: string;
      error?: string;
    };
    Calculated: {
      type: "CALC";
      value: string;
      error?: string;
    };
    Radio_button: {
      type: "RADIO_BUTTON";
      value: string;
      error?: string;
    };
    Drop_down: {
      type: "DROP_DOWN";
      value: string;
      error?: string;
    };
    Date: {
      type: "DATE";
      value: string;
      error?: string;
    };
    Time: {
      type: "TIME";
      value: string;
      error?: string;
    };
    Date_and_time: {
      type: "DATETIME";
      value: string;
      error?: string;
    };
    Link: {
      type: "LINK";
      value: string;
      error?: string;
    };
    Check_box: {
      type: "CHECK_BOX";
      value: string[];
      error?: string;
    };
    Multi_choice: {
      type: "MULTI_SELECT";
      value: string[];
      error?: string;
    };
    User_selection: {
      type: "USER_SELECT";
      value: { code: string; name: string }[];
      error?: string;
    };
    Department_selection: {
      type: "ORGANIZATION_SELECT";
      value: { code: string; name: string }[];
      error?: string;
    };
    Group_selection: {
      type: "GROUP_SELECT";
      value: { code: string; name: string }[];
      error?: string;
    };
    Attachment: {
      type: "FILE";
      value: {
        contentType: string;
        fileKey: string;
        name: string;
        size: string;
      }[];
      error?: string;
    };
    Table: {
      type: "SUBTABLE";
      value: {
        id: string;
        value: {
          Text_Table: {
            type: "SINGLE_LINE_TEXT";
            value: string;
            error?: string;
          };
          Rich_text_Table: {
            type: "RICH_TEXT";
            value: string;
            error?: string;
          };
          Text_area_Table: {
            type: "MULTI_LINE_TEXT";
            value: string;
            error?: string;
          };
          Number_Table: {
            type: "NUMBER";
            value: string;
            error?: string;
          };
          Calculated_Table: {
            type: "CALC";
            value: string;
            error?: string;
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
            error?: string;
          };
          Drop_down_Table: {
            type: "DROP_DOWN";
            value: string;
            error?: string;
          };
          Date_Table: {
            type: "DATE";
            value: string;
            error?: string;
          };
          Time_Table: {
            type: "TIME";
            value: string;
            error?: string;
          };
          Date_and_time_Table: {
            type: "DATETIME";
            value: string;
            error?: string;
          };
          Link_Table: {
            type: "LINK";
            value: string;
            error?: string;
          };
          Check_box_Table: {
            type: "CHECK_BOX";
            value: string[];
            error?: string;
          };
          Multi_choice_Table: {
            type: "MULTI_SELECT";
            value: string[];
            error?: string;
          };

          Attachment_Table: {
            type: "FILE";
            value: {
              contentType: string;
              fileKey: string;
              name: string;
              size: string;
            }[];
            error?: string;
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
      error?: string;
    };
    Created_datetime: {
      type: "CREATED_TIME";
      value: string;
      error?: string;
    };
  }
}
