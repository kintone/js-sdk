import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { uploadRecords } from "../../upload";

import { input } from "./fixtures/update_records/input";
import { properties } from "./fixtures/update_records/properties";
import { patterns as patternsSucceeded } from "./fixtures/update_records/patterns_succeeded";
import { patterns as patternsFailed } from "./fixtures/update_records/patterns_failed";

describe("update records correctly", () => {
  let apiClient: KintoneRestAPIClient;
  beforeEach(() => {
    apiClient = new KintoneRestAPIClient({
      baseUrl: "https://localhost/",
      auth: { apiToken: "dummy" },
    });
  });

  it.each(patternsSucceeded)(
    "$description",
    async ({ updateKey, expected }) => {
      apiClient.app.getFormFields = jest.fn().mockResolvedValue({
        properties,
      });
      const updateRecordsMockFn = jest.fn().mockResolvedValue({
        records: [
          {
            id: "1",
            revision: "2",
          },
          {
            id: "2",
            revision: "2",
          },
        ],
      });
      apiClient.record.updateRecords = updateRecordsMockFn;
      const addRecordsMockFn = jest.fn().mockResolvedValue({});
      apiClient.record.addRecords = addRecordsMockFn;

      const APP_ID = "1";
      await uploadRecords({
        apiClient,
        app: APP_ID,
        records: input,
        updateKey,
      });

      expect(updateRecordsMockFn).toBeCalledWith(expected);
      expect(addRecordsMockFn).not.toHaveBeenCalled();
    }
  );
});

describe("update records failed", () => {
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
