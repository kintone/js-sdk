import {
  KintoneFormFieldProperty,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { RecordForImport } from "../types/data-loader/import/record";
import { KintoneRecordForParameter } from "../types/kintone";
import { fieldProcessor, recordReducer } from "./add/record";

export const addRecords: (
  apiClient: KintoneRestAPIClient,
  app: string,
  records: RecordForImport[],
  options: {
    attachmentsDir?: string;
  }
) => Promise<void> = async (apiClient, app, records, { attachmentsDir }) => {
  const { properties } = await apiClient.app.getFormFields<
    Record<string, KintoneFormFieldProperty.OneOf>
  >({ app });

  const kintoneRecords = await convertRecordsToApiRequestParameter(
    apiClient,
    app,
    records,
    properties,
    {
      attachmentsDir,
    }
  );

  await uploadToKintone(apiClient, app, kintoneRecords);
};

const convertRecordsToApiRequestParameter = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  records: RecordForImport[],
  properties: Record<string, KintoneFormFieldProperty.OneOf>,
  options: {
    attachmentsDir?: string;
  }
): Promise<KintoneRecordForParameter[]> => {
  const { attachmentsDir } = options;

  const kintoneRecords: KintoneRecordForParameter[] = [];
  for (const record of records) {
    const kintoneRecord = await recordReducer(record, (fieldCode, field) =>
      fieldProcessor(apiClient, fieldCode, field, properties, {
        attachmentsDir,
      })
    );
    kintoneRecords.push(kintoneRecord);
  }
  return kintoneRecords;
};

const uploadToKintone = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  kintoneRecords: KintoneRecordForParameter[]
) => {
  if (kintoneRecords.length > 0) {
    try {
      await apiClient.record.addAllRecords({
        app,
        records: kintoneRecords,
      });
      console.log(`SUCCESS: add records[${kintoneRecords.length}]`);
    } catch (e) {
      console.log(`FAILED: add records[${kintoneRecords.length}]`);
      throw e;
    }
  }
};
