import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { upsertRecords } from "../../upsert";

import { input } from "./fixtures/input";
import { properties } from "./fixtures/properties";
import { patterns as patternsSucceeded } from "./fixtures/patterns_succeeded";
import { patterns as patternsFailed } from "./fixtures/patterns_failed";
import { existingRecords } from "./fixtures/existing_records";

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
      await upsertRecords(apiClient, APP_ID, input, updateKey, {});

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
        upsertRecords(apiClient, APP_ID, input, updateKey, {})
      ).rejects.toThrow(errorMessage);
    }
  );
});
