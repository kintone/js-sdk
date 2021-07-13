export type RecordMetadata<T extends FileName | FileKey> = {
  [fieldCode: string]: FieldMetadata<T>;
};

export type FileName = string;
export type FileKey = string;

type FieldMetadata<T extends FileName | FileKey> =
  | FileFieldMetadata<T>
  | SubtableFieldMetadata<T>;

export type FileFieldMetadata<T extends FileName | FileKey> = T[];

export type SubtableFieldMetadata<T extends FileName | FileKey> = Array<
  SubtableRowMetadata<T>
>;

export type SubtableRowMetadata<T extends FileName | FileKey> = {
  [fieldCode: string]: FileFieldMetadata<T>;
};

export { downloadAttachments } from "./export";

export { uploadAttachments, mergeRecordsAndMetadata } from "./import";
