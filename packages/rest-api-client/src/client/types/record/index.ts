import { Field } from "../../../KintoneFields/types/field";

export type Record<T = void> = T extends object
  ? {
      [fieldCode in Extract<keyof T, string>]: Field;
    }
  : {
      [fieldCode: string]: Field;
    };

export type UpdateKey = {
  field: string;
  value: string | number;
};

export type Mention = {
  code: string;
  type: "USER" | "GROUP" | "ORGANIZATION";
};

export type Comment = {
  id: string;
  text: string;
  createdAt: string;
  creator: {
    code: string;
    name: string;
  };
  mentions: Mention[];
};

export type CommentID = string | number;
