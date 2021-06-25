import {
  RecordMetadata,
  FileName,
  FileKey,
  FileFieldMetadata,
  SubtableFieldMetadata,
  SubtableRowMetadata,
} from "./";
import {
  KintoneFormFieldProperty,
  KintoneRecordField,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import path from "path";
import { KintoneRecordForParameter } from "../../types";
import fs from "fs";

export const uploadAttachments = async (
  apiClient: KintoneRestAPIClient,
  records: KintoneRecordForParameter[],
  recordSchema: Record<string, KintoneFormFieldProperty.OneOf>,
  recordMetadataList: Array<RecordMetadata<FileName>>,
  attachmentDir: string
): Promise<Array<RecordMetadata<FileKey>>> => {
  const metadataList: Array<RecordMetadata<FileKey>> = [];
  for (const [index, record] of records.entries()) {
    const recordMetadata = recordMetadataList[index];
    const metadata = await uploadRecordAttachments(
      apiClient,
      record,
      recordSchema,
      recordMetadata,
      attachmentDir
    );
    metadataList.push(metadata);
  }
  return metadataList;
};

const uploadRecordAttachments = async (
  apiClient: KintoneRestAPIClient,
  record: KintoneRecordForParameter,
  recordSchema: Record<string, KintoneFormFieldProperty.OneOf>,
  recordMetadata: RecordMetadata<FileName>,
  attachmentDir: string
): Promise<RecordMetadata<FileKey>> => {
  const metadata: RecordMetadata<FileKey> = {};
  for (const [fieldCode, fieldSchema] of Object.entries(recordSchema)) {
    const field = record[fieldCode];
    if (fieldSchema.type === "FILE") {
      metadata[fieldCode] = await uploadFileFieldAttachments(
        apiClient,
        field as Pick<KintoneRecordField.File, "value">,
        recordMetadata[fieldCode] as FileFieldMetadata<FileName>,
        attachmentDir
      );
    } else if (fieldSchema.type === "SUBTABLE") {
      metadata[fieldCode] = await uploadSubtableFieldAttachments(
        apiClient,
        field as { value: Array<{ value: { [fieldCode: string]: unknown } }> },
        fieldSchema,
        recordMetadata[fieldCode] as SubtableFieldMetadata<FileName>,
        attachmentDir
      );
    }
  }
  return metadata;
};

const uploadFileFieldAttachments = async (
  apiClient: KintoneRestAPIClient,
  field: Pick<KintoneRecordField.File, "value">,
  fieldMetadata: FileFieldMetadata<FileName>,
  attachmentDir: string
): Promise<FileFieldMetadata<FileKey>> => {
  const metadata: FileFieldMetadata<FileKey> = [];
  for (const [index, { name }] of field.value.entries()) {
    const filePath = path.resolve(attachmentDir, fieldMetadata[index]);
    const stream = fs.createReadStream(filePath);
    const data = await readStream(stream, "binary");
    const { fileKey } = await apiClient.file.uploadFile({
      file: { name, data },
    });
    metadata.push(fileKey);
  }
  return metadata;
};

const uploadSubtableFieldAttachments = async <
  T extends { [field: string]: KintoneFormFieldProperty.InSubtable }
>(
  apiClient: KintoneRestAPIClient,
  field: { value: Array<{ value: { [fieldCode: string]: unknown } }> },
  fieldSchema: KintoneFormFieldProperty.Subtable<T>,
  fieldMetadata: SubtableFieldMetadata<FileName>,
  attachmentDir: string
): Promise<SubtableFieldMetadata<FileKey>> => {
  const metadata: SubtableFieldMetadata<FileKey> = [];
  for (const [rowIndex, row] of field.value.entries()) {
    const rowMetadata: SubtableRowMetadata<FileKey> = {};
    for (const [fieldCodeInRow, fieldSchemaInRow] of Object.entries(
      fieldSchema.fields
    )) {
      const fieldInRow = row.value[fieldCodeInRow];
      if (fieldSchemaInRow.type === "FILE") {
        rowMetadata[fieldCodeInRow] = await uploadFileFieldAttachments(
          apiClient,
          fieldInRow as Pick<KintoneRecordField.File, "value">,
          fieldMetadata[rowIndex][fieldCodeInRow],
          attachmentDir
        );
      }
    }
    metadata.push(rowMetadata);
  }
  return metadata;
};

export const mergeRecordsAndMetadata = (
  records: KintoneRecordForParameter[],
  recordSchema: Record<string, KintoneFormFieldProperty.OneOf>,
  recordMetadataList: Array<RecordMetadata<FileKey>>
): KintoneRecordForParameter[] => {
  const newRecords: KintoneRecordForParameter[] = [];
  for (const [index, record] of records.entries()) {
    const recordMetadata = recordMetadataList[index];
    newRecords.push(
      mergeRecordAndMetadata(record, recordSchema, recordMetadata)
    );
  }
  return newRecords;
};

const mergeRecordAndMetadata = (
  record: KintoneRecordForParameter,
  recordSchema: Record<string, KintoneFormFieldProperty.OneOf>,
  recordMetadata: RecordMetadata<FileKey>
): KintoneRecordForParameter => {
  const newRecord: KintoneRecordForParameter = {};
  for (const [fieldCode, fieldSchema] of Object.entries(recordSchema)) {
    const field = record[fieldCode];
    if (fieldSchema.type === "FILE") {
      newRecord[fieldCode] = mergeFileFieldAndMetadata(
        field as Pick<KintoneRecordField.File, "value">,
        recordMetadata[fieldCode] as FileFieldMetadata<FileKey>
      );
    } else if (fieldSchema.type === "SUBTABLE") {
      newRecord[fieldCode] = mergeSubtableFieldAndMetadata(
        field as { value: Array<{ value: { [fieldCode: string]: unknown } }> },
        fieldSchema,
        recordMetadata[fieldCode] as SubtableFieldMetadata<FileKey>
      );
    } else {
      newRecord[fieldCode] = field;
    }
  }
  return newRecord;
};

const mergeFileFieldAndMetadata = (
  field: { value: Array<{ fileKey: string }> },
  fieldMetadata: FileFieldMetadata<FileKey>
): { value: Array<{ fileKey: string }> } => {
  return {
    value: field.value.map((_, index) => ({ fileKey: fieldMetadata[index] })),
  };
};

const mergeSubtableFieldAndMetadata = <
  T extends { [field: string]: KintoneFormFieldProperty.InSubtable }
>(
  field: { value: Array<{ value: { [fieldCode: string]: unknown } }> },
  fieldSchema: KintoneFormFieldProperty.Subtable<T>,
  fieldMetadata: SubtableFieldMetadata<FileKey>
): { value: Array<{ value: { [fieldCode: string]: unknown } }> } => {
  const newField: {
    value: Array<{ value: { [fieldCode: string]: unknown } }>;
  } = { value: [] };
  for (const [rowIndex, row] of field.value.entries()) {
    const newRow: { value: { [fieldCode: string]: unknown } } = { value: {} };
    for (const [fieldCodeInRow, fieldSchemaInRow] of Object.entries(
      fieldSchema.fields
    )) {
      const fieldInRow = row.value[fieldCodeInRow];
      if (fieldSchemaInRow.type === "FILE") {
        newRow.value[fieldCodeInRow] = mergeFileFieldAndMetadata(
          fieldInRow as Pick<KintoneRecordField.File, "value">,
          fieldMetadata[rowIndex][fieldCodeInRow]
        );
      }
    }
    newField.value.push(newRow);
  }
  return newField;
};

// TODO: Refactor
const readStream = async (
  stream: fs.ReadStream,
  encoding: BufferEncoding = "utf8"
) => {
  stream.setEncoding(encoding);
  let content = "";
  for await (const chunk of stream) {
    content += chunk;
  }
  return Buffer.from(content, encoding);
};
