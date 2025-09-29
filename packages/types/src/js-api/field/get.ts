// https://cybozu.dev/ja/kintone/docs/overview/field-types/

export {};

type RecordNumber = {
  type: "RECORD_NUMBER";
  value: string;
};

type Id = {
  type: "__ID__";
  value: string;
};

type Revision = {
  type: "__REVISION__";
  value: string;
};

type Creator = {
  type: "CREATOR";
  value: { code: string; name: string };
};

type CreatedTime = {
  type: "CREATED_TIME";
  value: string;
};

type Modifier = {
  type: "MODIFIER";
  value: { code: string; name: string };
};

type UpdatedTime = {
  type: "UPDATED_TIME";
  value: string;
};

type SingleLineText = {
  type?: "SINGLE_LINE_TEXT";
  value: string;
  disabled?: boolean;
  error?: string | null;
};

type RichText = {
  type?: "RICH_TEXT";
  value: string;
  disabled?: boolean;
  error?: string | null;
};

type MultiLineText = {
  type?: "MULTI_LINE_TEXT";
  value: string;
  disabled?: boolean;
  error?: string | null;
};

type Number = {
  type?: "NUMBER";
  value: string;
  disabled?: boolean;
  error?: string | null;
};

type Calc = {
  type: "CALC";
  value: string;
  disabled?: boolean;
};

type RadioButton = {
  type?: "RADIO_BUTTON";
  value: string;
  disabled?: boolean;
  error?: string | null;
};

type DropDown = {
  type?: "DROP_DOWN";
  value: string;
  disabled?: boolean;
  error?: string | null;
};

type Date = {
  type?: "DATE";
  value: string;
  disabled?: boolean;
  error?: string | null;
};

type Time = {
  type?: "TIME";
  value: string;
  disabled?: boolean;
  error?: string | null;
};

type DateTime = {
  type?: "DATETIME";
  value: string;
  disabled?: boolean;
  error?: string | null;
};

type Link = {
  type?: "LINK";
  value: string;
  disabled?: boolean;
  error?: string | null;
};

type CheckBox = {
  type?: "CHECK_BOX";
  value: string[];
  disabled?: boolean;
  error?: string | null;
};

type MultiSelect = {
  type?: "MULTI_SELECT";
  value: string[];
  disabled?: boolean;
  error?: string | null;
};

type UserSelect = {
  type?: "USER_SELECT";
  value: Array<{ code: string; name: string }>;
  disabled?: boolean;
  error?: string | null;
};

type OrganizationSelect = {
  type?: "ORGANIZATION_SELECT";
  value: Array<{ code: string; name: string }>;
  disabled?: boolean;
  error?: string | null;
};

type GroupSelect = {
  type?: "GROUP_SELECT";
  value: Array<{ code: string; name: string }>;
  disabled?: boolean;
  error?: string | null;
};

type File = {
  type: "FILE";
  value: Array<{
    contentType: string;
    fileKey: string;
    name: string;
    size: string;
  }>;
  disabled?: boolean;
  error?: string | null;
};
