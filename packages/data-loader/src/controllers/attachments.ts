export type AttachmentMetadata = Record;

type Record = {
  [fieldCode: string]: Field;
};

type Field = FileField | SubtableField;

type FileField = string[];

export type SubtableField = SubtableRow[];

export type SubtableRow = {
  [fieldCode: string]: FileField;
};
