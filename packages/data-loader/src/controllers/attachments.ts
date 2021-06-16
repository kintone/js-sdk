export type AttachmentMetadata = Record;

type Record = {
  [fieldCode: string]: Field;
};

type Field = FileField | SubTableField;

type FileField = string[];

export type SubTableField = SubTableRow[];

export type SubTableRow = {
  [fieldCode: string]: FileField;
};
