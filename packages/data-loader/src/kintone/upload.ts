import {
  KintoneRecordForParameter,
  KintoneRecordForUpdateParameter,
} from "../types/kintone";
import {
  KintoneFormFieldProperty,
  KintoneRecordField,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { RecordForImport, FieldsForImport } from "../types/data-loader";
import path from "path";

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

  let recordsOnKintone: Set<string> | undefined;
  if (updateKey) {
    validateUpdateKey(properties, updateKey);

    const tmp = await apiClient.record.getAllRecords({
      app,
      fields: [updateKey],
    });
    recordsOnKintone = new Set(
      tmp.map(
        (record) =>
          (
            record[updateKey] as
              | KintoneRecordField.SingleLineText
              | KintoneRecordField.Number
          ).value
      )
    );
  }

  const kintoneRecords = await recordsReducer(
    records,
    (fieldCode, field) =>
      fieldProcessor(fieldCode, field, properties, {
        apiClient,
        attachmentsDir,
      }),
    updateKey,
    recordsOnKintone
  );

  // TODO: remove this debug message
  console.log(
    `records to be updated: ${JSON.stringify(
      kintoneRecords.update,
      null,
      2
    )}, records to be added: ${JSON.stringify(kintoneRecords.add, null, 2)}`
  );

  // TODO: message on success
  // TODO: message on failure
  if (kintoneRecords.update.length > 0) {
    await apiClient.record.updateAllRecords({
      app,
      records: kintoneRecords.update,
    });
  }
  if (kintoneRecords.add.length > 0) {
    await apiClient.record.addAllRecords({
      app,
      records: kintoneRecords.add,
    });
  }
};

const recordsReducer: (
  records: RecordForImport[],
  task: (
    fieldCode: string,
    field: FieldsForImport.OneOf
  ) => Promise<KintoneRecordForParameter[string]>,
  updateKey?: string,
  recordsOnKintone?: Set<string>
) => Promise<{
  add: KintoneRecordForParameter[];
  update: KintoneRecordForUpdateParameter[];
}> = async (kintoneRecords, task, updateKey, recordsOnKintone) => {
  const recordsForAdd: KintoneRecordForParameter[] = [];
  const recordsForUpdate: KintoneRecordForUpdateParameter[] = [];
  for (const kintoneRecord of kintoneRecords) {
    if (
      updateKey &&
      recordsOnKintone?.has(kintoneRecord[updateKey].value as string)
    ) {
      const record = await recordReducerForUpdate(
        kintoneRecord,
        (fieldCode, field) => task(fieldCode, field),
        updateKey
      );
      recordsForUpdate.push(record);
    } else {
      const record = await recordReducerAdd(kintoneRecord, (fieldCode, field) =>
        task(fieldCode, field)
      );
      recordsForAdd.push(record);
    }
  }
  return { add: recordsForAdd, update: recordsForUpdate };
};

const recordReducerAdd: (
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

const recordReducerForUpdate: (
  record: RecordForImport,
  task: (
    fieldCode: string,
    field: FieldsForImport.OneOf
  ) => Promise<KintoneRecordForParameter[string]>,
  updateKey: string
) => Promise<KintoneRecordForUpdateParameter> = async (
  record,
  task,
  updateKey
) => {
  const newRecord: KintoneRecordForParameter = {};
  for (const [fieldCode, field] of Object.entries(record)) {
    newRecord[fieldCode] = await task(fieldCode, field);
  }
  const recordUpdateKey = {
    field: updateKey,
    value: newRecord[updateKey].value as string | number,
  };
  delete newRecord[updateKey];

  return {
    updateKey: recordUpdateKey,
    record: newRecord,
  };
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

const validateUpdateKey = (
  properties: Record<string, KintoneFormFieldProperty.OneOf>,
  updateKey: string
) => {
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
};
