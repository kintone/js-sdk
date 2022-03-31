import {
  KintoneRecordForParameter,
  KintoneRecordForUpdateParameter,
} from "../types/kintone";
import {
  KintoneFormFieldProperty,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { RecordForImport, FieldsForImport } from "../types/data-loader";
import path from "path";

const CHUNK_LENGTH = 100;

export const uploadRecords: (options: {
  apiClient: KintoneRestAPIClient;
  attachmentsDir?: string;
  app: string;
  records: RecordForImport[];
  updateKey?: string;
}) => Promise<void> = async (options) => {
  const { apiClient, attachmentsDir, app, records, updateKey } = options;

  const { properties } = await apiClient.app.getFormFields<
    Record<string, KintoneFormFieldProperty.OneOf>
  >({ app });

  if (updateKey) {
    const supportedUpdateKeyFieldTypes = ["SINGLE_LINE_TEXT", "NUMBER"];

    if (!properties[updateKey]) {
      throw new Error("no such update key");
    }

    if (!supportedUpdateKeyFieldTypes.includes(properties[updateKey].type)) {
      throw new Error("unsupported field type for update key");
    }

    if (
      !(
        properties[updateKey] as
          | KintoneFormFieldProperty.SingleLineText
          | KintoneFormFieldProperty.Number
      ).unique
    ) {
      throw new Error("update key field should set to unique");
    }
  }

  let chunkStartIndex = 0;
  while (chunkStartIndex < records.length) {
    const chunkNextIndex = Math.min(
      records.length,
      chunkStartIndex + CHUNK_LENGTH
    );
    try {
      const kintoneRecords: Array<
        KintoneRecordForParameter | KintoneRecordForUpdateParameter
      > = await recordsReducer(
        records,
        (fieldCode, field) =>
          fieldProcessor(fieldCode, field, properties, {
            apiClient,
            attachmentsDir,
          }),
        updateKey
      );
      if (updateKey) {
        await apiClient.record.updateRecords({
          app,
          records: kintoneRecords.slice(
            chunkStartIndex,
            chunkNextIndex
          ) as KintoneRecordForUpdateParameter[],
        });
      } else {
        await apiClient.record.addRecords({
          app,
          records: kintoneRecords.slice(
            chunkStartIndex,
            chunkNextIndex
          ) as KintoneRecordForParameter[],
        });
      }

      console.log(
        `SUCCESS: records[${chunkStartIndex} - ${chunkNextIndex - 1}]`
      );
    } catch (e) {
      console.log(
        `FAILED: records[${chunkStartIndex} - ${records.length - 1}]`
      );
      throw e;
    }
    chunkStartIndex = chunkNextIndex;
  }
};

const recordsReducer: (
  records: RecordForImport[],
  task: (
    fieldCode: string,
    field: FieldsForImport.OneOf
  ) => Promise<KintoneRecordForParameter[string]>,
  updateKey?: string
) => Promise<
  Array<KintoneRecordForParameter | KintoneRecordForUpdateParameter>
> = async (kintoneRecords, task, updateKey) => {
  const records: Array<
    KintoneRecordForParameter | KintoneRecordForUpdateParameter
  > = [];
  for (const kintoneRecord of kintoneRecords) {
    const record = await recordReducer(kintoneRecord, (fieldCode, field) =>
      task(fieldCode, field)
    );
    if (updateKey) {
      const recordUpdateKey = {
        field: updateKey,
        value: record[updateKey].value as string | number,
      };
      delete record[updateKey];
      const recordForUpdate: KintoneRecordForUpdateParameter = {
        updateKey: recordUpdateKey,
        record: record,
      };
      records.push(recordForUpdate);
    } else {
      records.push(record);
    }
  }
  return records;
};

const recordReducer: (
  record: RecordForImport,
  task: (
    fieldCode: string,
    field: FieldsForImport.OneOf
  ) => Promise<KintoneRecordForParameter[string]>
) => Promise<KintoneRecordForParameter> = async (record, task) => {
  const newRecord: KintoneRecordForParameter = {};
  for (const [fieldCode, field] of Object.entries(record)) {
    newRecord[fieldCode] = await task(fieldCode, field);
  }
  return newRecord;
};

const fieldProcessor: (
  fieldCode: string,
  field: FieldsForImport.OneOf,
  properties: Record<string, KintoneFormFieldProperty.OneOf>,
  options: { apiClient: KintoneRestAPIClient; attachmentsDir?: string }
) => Promise<KintoneRecordForParameter[string]> = async (
  fieldCode,
  field,
  properties,
  options
) => {
  const { attachmentsDir, apiClient } = options;

  // TODO: filter fields

  switch (properties[fieldCode].type) {
    case "FILE": {
      if (!attachmentsDir) {
        throw new Error("--attachments-dir option is required.");
      }
      const uploadedList: Array<{ fileKey: string }> = [];
      for (const fileInfo of (field as FieldsForImport.File).value) {
        if (!fileInfo.localFilePath) {
          throw new Error("local file path not defined.");
        }
        const { fileKey } = await apiClient.file.uploadFile({
          file: {
            path: path.join(attachmentsDir, fileInfo.localFilePath),
          },
        });
        uploadedList.push({
          fileKey,
        });
      }
      return {
        value: uploadedList,
      };
    }
    case "SUBTABLE": {
      const newRows = [];

      const subtableValue = (field as FieldsForImport.Subtable).value;
      for (const row of subtableValue) {
        const fieldsInRow: KintoneRecordForParameter = {};
        for (const [fieldCodeInSubtable, fieldInSubtable] of Object.entries(
          row.value
        )) {
          fieldsInRow[fieldCodeInSubtable] = await fieldProcessor(
            fieldCodeInSubtable,
            fieldInSubtable,
            (
              properties[fieldCode] as KintoneFormFieldProperty.Subtable<{
                [fieldCode: string]: KintoneFormFieldProperty.InSubtable;
              }>
            ).fields,
            { apiClient, attachmentsDir }
          );
        }
        newRows.push({ id: row.id, value: fieldsInRow });
      }
      return {
        value: newRows,
      };
    }
    default:
      return field;
  }
};
