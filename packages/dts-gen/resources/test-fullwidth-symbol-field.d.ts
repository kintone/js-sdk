declare namespace kintone.types {
  interface TestFields {
    "・": {
      type: "SINGLE_LINE_TEXT";
      value: string;
      disabled?: boolean;
      error?: string;
    };
    "＄": {
      type: "SINGLE_LINE_TEXT";
      value: string;
      disabled?: boolean;
      error?: string;
    };
    "￥": {
      type: "SINGLE_LINE_TEXT";
      value: string;
      disabled?: boolean;
      error?: string;
    };
    "＿": {
      type: "SINGLE_LINE_TEXT";
      value: string;
      disabled?: boolean;
      error?: string;
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
    Record_number: {
      type: "RECORD_NUMBER";
      value: string;
      error?: string;
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
