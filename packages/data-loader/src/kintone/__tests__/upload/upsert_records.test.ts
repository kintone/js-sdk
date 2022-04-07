import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { uploadRecords } from "../../upload";

import { input } from "./fixtures/upsert_records/input";
import { properties } from "./fixtures/upsert_records/properties";
import { patterns as patternsSucceeded } from "./fixtures/upsert_records/patterns_succeeded";
import { patterns as patternsFailed } from "./fixtures/upsert_records/patterns_failed";
import { existingRecords } from "./fixtures/upsert_records/existing_records";

describe("upsert records correctly", () => {
  let apiClient: KintoneRestAPIClient;
  beforeEach(() => {
    apiClient = new KintoneRestAPIClient({
      baseUrl: "https://localhost/",
      auth: { apiToken: "dummy" },
    });
  });

  it.each(patternsSucceeded)(
    "$description",
    async ({ updateKey, forUpdateExpected, forAddExpected }) => {
      apiClient.app.getFormFields = jest.fn().mockResolvedValue({
        properties,
      });

      const getAllRecordsMockFn = jest.fn().mockResolvedValue(existingRecords);
      apiClient.record.getAllRecords = getAllRecordsMockFn;
      const updateAllRecordsMockFn = jest.fn().mockResolvedValue({
        records: [
          {
            id: "1",
            revision: "2",
          },
        ],
      });
      apiClient.record.updateAllRecords = updateAllRecordsMockFn;
      const addAllRecordsMockFn = jest.fn().mockResolvedValue({});
      apiClient.record.addAllRecords = addAllRecordsMockFn;

      const APP_ID = "1";
      await uploadRecords({
        apiClient,
        app: APP_ID,
        records: input,
        updateKey,
      });

      expect(updateAllRecordsMockFn).toBeCalledWith(forUpdateExpected);
      expect(addAllRecordsMockFn).toBeCalledWith(forAddExpected);
    }
  );
});

describe("upsert records failed", () => {
  let apiClient: KintoneRestAPIClient;
  beforeEach(() => {
    apiClient = new KintoneRestAPIClient({
      baseUrl: "https://localhost/",
      auth: { apiToken: "dummy" },
    });
  });

  it.each(patternsFailed)(
    "$description",
    async ({ updateKey, errorMessage }) => {
      apiClient.app.getFormFields = jest.fn().mockResolvedValue({
        properties,
      });

      const APP_ID = "1";
      await expect(
        uploadRecords({
          apiClient,
          app: APP_ID,
          records: input,
          updateKey,
        })
      ).rejects.toThrow(errorMessage);
    }
  );
});
