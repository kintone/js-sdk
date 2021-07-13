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

export const uploadAttachments = async (params: {
  apiClient: KintoneRestAPIClient;
  records: KintoneRecordForParameter[];
  recordSchema: Record<string, KintoneFormFieldProperty.OneOf>;
  recordMetadataList: Array<RecordMetadata<FileName>>;
  sourceDir: string;
}): Promise<Array<RecordMetadata<FileKey>>> => {
  const { apiClient, records, recordSchema, recordMetadataList, sourceDir } =
    params;
  const metadataList: Array<RecordMetadata<FileKey>> = [];
  for (const [index, record] of records.entries()) {
    const recordMetadata = recordMetadataList[index];
    const metadata = await uploadRecordAttachments({
      apiClient,
      record,
      recordSchema,
      recordMetadata,
      sourceDir,
    });
    metadataList.push(metadata);
  }
  return metadataList;
};

const uploadRecordAttachments = async (params: {
  apiClient: KintoneRestAPIClient;
  record: KintoneRecordForParameter;
  recordSchema: Record<string, KintoneFormFieldProperty.OneOf>;
  recordMetadata: RecordMetadata<FileName>;
  sourceDir: string;
}): Promise<RecordMetadata<FileKey>> => {
  const { apiClient, record, recordSchema, recordMetadata, sourceDir } = params;
  const metadata: RecordMetadata<FileKey> = {};
  for (const [fieldCode, fieldSchema] of Object.entries(recordSchema)) {
    const field = record[fieldCode];
    if (fieldSchema.type === "FILE") {
      metadata[fieldCode] = await uploadFileFieldAttachments({
        apiClient,
        field: field as Pick<KintoneRecordField.File, "value">,
        fieldMetadata: recordMetadata[fieldCode] as FileFieldMetadata<FileName>,
        sourceDir,
      });
    } else if (fieldSchema.type === "SUBTABLE") {
      metadata[fieldCode] = await uploadSubtableFieldAttachments({
        apiClient,
        field: field as {
          value: Array<{ value: { [fieldCode: string]: unknown } }>;
        },
        fieldSchema,
        fieldMetadata: recordMetadata[
          fieldCode
        ] as SubtableFieldMetadata<FileName>,
        sourceDir,
      });
    }
  }
  return metadata;
};

const uploadSubtableFieldAttachments = async <
  T extends { [field: string]: KintoneFormFieldProperty.InSubtable }
>(params: {
  apiClient: KintoneRestAPIClient;
  field: { value: Array<{ value: { [fieldCode: string]: unknown } }> };
  fieldSchema: KintoneFormFieldProperty.Subtable<T>;
  fieldMetadata: SubtableFieldMetadata<FileName>;
  sourceDir: string;
}): Promise<SubtableFieldMetadata<FileKey>> => {
  const { apiClient, field, fieldSchema, fieldMetadata, sourceDir } = params;
  const metadata: SubtableFieldMetadata<FileKey> = [];
  for (const [rowIndex, row] of field.value.entries()) {
    const rowMetadata: SubtableRowMetadata<FileKey> = {};
    for (const [fieldCodeInRow, fieldSchemaInRow] of Object.entries(
      fieldSchema.fields
    )) {
      const fieldInRow = row.value[fieldCodeInRow];
      if (fieldSchemaInRow.type === "FILE") {
        rowMetadata[fieldCodeInRow] = await uploadFileFieldAttachments({
          apiClient,
          field: fieldInRow as Pick<KintoneRecordField.File, "value">,
          fieldMetadata: fieldMetadata[rowIndex][fieldCodeInRow],
          sourceDir,
        });
      }
    }
    metadata.push(rowMetadata);
  }
  return metadata;
};

const uploadFileFieldAttachments = async (params: {
  apiClient: KintoneRestAPIClient;
  field: Pick<KintoneRecordField.File, "value">;
  fieldMetadata: FileFieldMetadata<FileName>;
  sourceDir: string;
}): Promise<FileFieldMetadata<FileKey>> => {
  const { apiClient, field, fieldMetadata, sourceDir } = params;
  const metadata: FileFieldMetadata<FileKey> = [];
  for (const [index, { name }] of field.value.entries()) {
    const filePath = path.resolve(sourceDir, fieldMetadata[index]);
    const stream = fs.createReadStream(filePath);
    const data = await readStream(stream, "binary");
    const { fileKey } = await apiClient.file.uploadFile({
      file: { name, data },
    });
    metadata.push(fileKey);
  }
  return metadata;
};

export const mergeRecordsAndMetadata = (params: {
  records: KintoneRecordForParameter[];
  recordSchema: Record<string, KintoneFormFieldProperty.OneOf>;
  recordMetadataList: Array<RecordMetadata<FileKey>>;
}): KintoneRecordForParameter[] => {
  const { records, recordSchema, recordMetadataList } = params;
  const newRecords: KintoneRecordForParameter[] = [];
  for (const [index, record] of records.entries()) {
    const recordMetadata = recordMetadataList[index];
    newRecords.push(
      mergeRecordAndMetadata({ record, recordSchema, recordMetadata })
    );
  }
  return newRecords;
};

const mergeRecordAndMetadata = (params: {
  record: KintoneRecordForParameter;
  recordSchema: Record<string, KintoneFormFieldProperty.OneOf>;
  recordMetadata: RecordMetadata<FileKey>;
}): KintoneRecordForParameter => {
  const { record, recordSchema, recordMetadata } = params;
  const newRecord: KintoneRecordForParameter = {};
  for (const [fieldCode, fieldSchema] of Object.entries(recordSchema)) {
    const field = record[fieldCode];
    if (fieldSchema.type === "FILE") {
      newRecord[fieldCode] = mergeFileFieldAndMetadata({
        field: field as Pick<KintoneRecordField.File, "value">,
        fieldMetadata: recordMetadata[fieldCode] as FileFieldMetadata<FileKey>,
      });
    } else if (fieldSchema.type === "SUBTABLE") {
      newRecord[fieldCode] = mergeSubtableFieldAndMetadata({
        field: field as {
          value: Array<{ value: { [fieldCode: string]: unknown } }>;
        },
        fieldSchema,
        fieldMetadata: recordMetadata[
          fieldCode
        ] as SubtableFieldMetadata<FileKey>,
      });
    } else {
      newRecord[fieldCode] = field;
    }
  }
  return newRecord;
};

const mergeSubtableFieldAndMetadata = <
  T extends { [field: string]: KintoneFormFieldProperty.InSubtable }
>(params: {
  field: { value: Array<{ value: { [fieldCode: string]: unknown } }> };
  fieldSchema: KintoneFormFieldProperty.Subtable<T>;
  fieldMetadata: SubtableFieldMetadata<FileKey>;
}): { value: Array<{ value: { [fieldCode: string]: unknown } }> } => {
  const { field, fieldSchema, fieldMetadata } = params;
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
        newRow.value[fieldCodeInRow] = mergeFileFieldAndMetadata({
          field: fieldInRow as Pick<KintoneRecordField.File, "value">,
          fieldMetadata: fieldMetadata[rowIndex][fieldCodeInRow],
        });
      }
    }
    newField.value.push(newRow);
  }
  return newField;
};

const mergeFileFieldAndMetadata = (params: {
  field: { value: Array<{ fileKey: string }> };
  fieldMetadata: FileFieldMetadata<FileKey>;
}): { value: Array<{ fileKey: string }> } => {
  const { field, fieldMetadata } = params;
  return {
    value: field.value.map((_, index) => ({ fileKey: fieldMetadata[index] })),
  };
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
