import {
  KintoneFormFieldProperty,
  KintoneRecordField,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { RecordForImport } from "../types/data-loader/import/record";
import {
  KintoneRecordForParameter,
  KintoneRecordForUpdateParameter,
} from "../types/kintone";
import { fieldProcessor, recordReducer } from "./add/record";

export const upsertRecords: (
  apiClient: KintoneRestAPIClient,
  app: string,
  records: RecordForImport[],
  updateKey: string,
  options: {
    attachmentsDir?: string;
  }
) => Promise<void> = async (
  apiClient,
  app,
  records,
  updateKey,
  { attachmentsDir }
) => {
  const { properties } = await apiClient.app.getFormFields<
    Record<string, KintoneFormFieldProperty.OneOf>
  >({ app });

  validateUpdateKey(properties, updateKey);

  const kintoneRecords = await convertRecordsToApiRequestParameter(
    apiClient,
    app,
    records,
    updateKey,
    properties,
    {
      attachmentsDir,
    }
  );

  await uploadToKintone(apiClient, app, kintoneRecords);
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

const convertRecordsToApiRequestParameter = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  records: RecordForImport[],
  updateKey: string,
  properties: Record<string, KintoneFormFieldProperty.OneOf>,
  options: {
    attachmentsDir?: string;
  }
): Promise<{
  forAdd: KintoneRecordForParameter[];
  forUpdate: KintoneRecordForUpdateParameter[];
}> => {
  const { attachmentsDir } = options;
  const recordsOnKintone = await apiClient.record.getAllRecords({
    app,
    fields: [updateKey],
  });
  const existingUpdateKeyValues = new Set(
    recordsOnKintone.map(
      (record) =>
        (
          record[updateKey] as
            | KintoneRecordField.SingleLineText
            | KintoneRecordField.Number
        ).value
    )
  );

  const kintoneRecordsForAdd: KintoneRecordForParameter[] = [];
  const kintoneRecordsForUpdate: KintoneRecordForUpdateParameter[] = [];
  for (const record of records) {
    const kintoneRecord = await recordReducer(record, (fieldCode, field) =>
      fieldProcessor(apiClient, fieldCode, field, properties, {
        attachmentsDir,
      })
    );
    if (record[updateKey] === undefined) {
      throw new Error(
        `The field specified as "Key to Bulk Update" (${updateKey}) does not exist on input`
      );
    }
    if (existingUpdateKeyValues.has(record[updateKey].value as string)) {
      const recordUpdateKey = {
        field: updateKey,
        value: kintoneRecord[updateKey].value as string | number,
      };
      delete kintoneRecord[updateKey];
      kintoneRecordsForUpdate.push({
        updateKey: recordUpdateKey,
        record: kintoneRecord,
      });
    } else {
      kintoneRecordsForAdd.push(kintoneRecord);
    }
  }
  return { forAdd: kintoneRecordsForAdd, forUpdate: kintoneRecordsForUpdate };
};

const uploadToKintone = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  kintoneRecords: {
    forAdd: KintoneRecordForParameter[];
    forUpdate: KintoneRecordForUpdateParameter[];
  }
) => {
  if (kintoneRecords.forUpdate.length > 0) {
    try {
      await apiClient.record.updateAllRecords({
        app,
        records: kintoneRecords.forUpdate,
      });
      console.log(
        `SUCCESS: update records[${kintoneRecords.forUpdate.length}]`
      );
    } catch (e) {
      console.log(`FAILED: update records[${kintoneRecords.forUpdate.length}]`);
      throw e;
    }
  }
  if (kintoneRecords.forAdd.length > 0) {
    try {
      await apiClient.record.addAllRecords({
        app,
        records: kintoneRecords.forAdd,
      });
      console.log(`SUCCESS: add records[${kintoneRecords.forAdd.length}]`);
    } catch (e) {
      console.log(`FAILED: add records[${kintoneRecords.forAdd.length}]`);
      throw e;
    }
  }
};
