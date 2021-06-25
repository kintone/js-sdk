export type RecordMetadata = {
  [fieldCode: string]: FieldMetadata;
};

export type FileName = string;

type FieldMetadata = FileFieldMetadata | SubtableFieldMetadata;

export type FileFieldMetadata = FileName[];

export type SubtableFieldMetadata = SubtableRowMetadata[];

export type SubtableRowMetadata = {
  [fieldCode: string]: FileFieldMetadata;
};

export { downloadAttachments } from "./export";
