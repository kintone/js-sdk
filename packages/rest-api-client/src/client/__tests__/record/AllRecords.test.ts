import { KintoneAllRecordsError, KintoneRestAPIError } from "../../../error";
import type { MockClient } from "../../../http/MockClient";
import type { RecordClient } from "../../RecordClient";
import type { Record } from "../../types";
import {
  APP_ID,
  fieldCode,
  makeClients,
} from "../fixtures/RecordClientFixture";

describe("AllRecordsTest", () => {
  let mockClient: MockClient;
  let recordClient: RecordClient;

  beforeEach(() => {
    const clients = makeClients();
    recordClient = clients.recordClient;
    mockClient = clients.mockClient;
  });

  describe("getAllRecordsWithId", () => {
    describe("success with condition", () => {
      it("should do nothing if `fields` is not specified", async () => {
        const params = {
          app: APP_ID,
          condition: `${fieldCode} = "foo"`,
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithId<Record>(params);
        expect(mockClient.getLogs()[0].params.fields).toBe(undefined);
      });

      it("should do nothing if `fields` is empty", async () => {
        const params = {
          app: APP_ID,
          fields: [],
          condition: `${fieldCode} = "foo"`,
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithId<Record>(params);
        expect(mockClient.getLogs()[0].params.fields).toEqual([]);
      });

      it("should append `$id` if `fields` is specified and doesn't contain `$id`", async () => {
        const params = {
          app: APP_ID,
          fields: [fieldCode],
          condition: `${fieldCode} = "foo"`,
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithId<Record>(params);
        expect(mockClient.getLogs()[0].params.fields.sort()).toEqual(
          [...params.fields, "$id"].sort(),
        );
      });

      it("should do nothing if `fields` is specified and contains `$id`", async () => {
        const params = {
          app: APP_ID,
          fields: ["$id", fieldCode],
          condition: `${fieldCode} = "foo"`,
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithId<Record>(params);
        expect(mockClient.getLogs()[0].params.fields).toEqual(params.fields);
      });
    });

    describe("success with condition", () => {
      const params = {
        app: APP_ID,
        fields: ["$id"],
        condition: `${fieldCode} = "foo"`,
      };
      let result: Record[];

      beforeEach(async () => {
        const records = [];
        for (let i = 1; i <= 500; i++) {
          records.push({
            $id: {
              type: "__ID__",
              value: i.toString(),
            },
          });
        }
        mockClient.mockResponse({ records });
        mockClient.mockResponse({
          records: [{ $id: { type: "__ID__", value: "501" } }],
        });
        result = await recordClient.getAllRecordsWithId<Record>(params);
      });

      it("should return all records", () => {
        expect(mockClient.getLogs()[0]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: `(${params.condition}) and $id > 0 order by $id asc limit 500`,
          },
        });
        expect(mockClient.getLogs()[1]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: `(${params.condition}) and $id > 500 order by $id asc limit 500`,
          },
        });

        expect(result.length).toBe(501);
        expect(result[500]).toStrictEqual({
          $id: { type: "__ID__", value: "501" },
        });
      });
    });

    describe("success without condition", () => {
      const params = {
        app: APP_ID,
        fields: ["$id"],
      };
      let result: Record[];

      beforeEach(async () => {
        const records = [];
        for (let i = 1; i <= 500; i++) {
          records.push({
            $id: {
              type: "__ID__",
              value: i.toString(),
            },
          });
        }
        mockClient.mockResponse({ records });
        mockClient.mockResponse({
          records: [{ $id: { type: "__ID__", value: "501" } }],
        });
        result = await recordClient.getAllRecordsWithId<Record>(params);
      });

      it("should return all records", () => {
        expect(mockClient.getLogs()[0]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: "$id > 0 order by $id asc limit 500",
          },
        });
        expect(mockClient.getLogs()[1]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: "$id > 500 order by $id asc limit 500",
          },
        });

        expect(result.length).toBe(501);
        expect(result[500]).toStrictEqual({
          $id: { type: "__ID__", value: "501" },
        });
      });
    });

    describe("error in missing $id", () => {
      it("should throw error when missing $id in `getRecords` response.", async () => {
        const records: Record[] = [];
        for (let i = 1; i < 500; i++) {
          records.push({
            $id: {
              type: "__ID__",
              value: i.toString(),
            },
          });
        }
        records.push({
          $id: {
            type: "RECORD_NUMBER",
            value: "2",
          },
        });
        mockClient.mockResponse({ records });
        const params = {
          app: APP_ID,
        };

        await expect(recordClient.getAllRecordsWithId(params)).rejects.toThrow(
          "Missing `$id` in `getRecords` response. This error is likely caused by a bug in Kintone REST API Client. Please file an issue.",
        );
      });
    });
  });

  describe("getAllRecordsWithOffset", () => {
    describe("condition and orderBy parameters", () => {
      it("with condition and orderBy", async () => {
        const params = {
          app: APP_ID,
          condition: `${fieldCode} = "foo"`,
          orderBy: `${fieldCode} asc`,
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithOffset<Record>(params);
        expect(mockClient.getLogs()[0].params.query).toBe(
          `${fieldCode} = "foo" order by ${fieldCode} asc limit 500 offset 0`,
        );
      });

      it("with condition, without orderBy", async () => {
        const params = {
          app: APP_ID,
          condition: `${fieldCode} = "foo"`,
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithOffset<Record>(params);
        expect(mockClient.getLogs()[0].params.query).toBe(
          `${fieldCode} = "foo" limit 500 offset 0`,
        );
      });

      it("without condition, with orderBy", async () => {
        const params = {
          app: APP_ID,
          orderBy: `${fieldCode} asc`,
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithOffset<Record>(params);
        expect(mockClient.getLogs()[0].params.query).toBe(
          `order by ${fieldCode} asc limit 500 offset 0`,
        );
      });

      it("neither condition nor orderBy", async () => {
        const params = {
          app: APP_ID,
        };
        mockClient.mockResponse({ records: [] });
        await recordClient.getAllRecordsWithOffset<Record>(params);
        expect(mockClient.getLogs()[0].params.query).toBe("limit 500 offset 0");
      });
    });

    describe("success", () => {
      const params = {
        app: APP_ID,
        fields: ["$id"],
        condition: `${fieldCode} = "foo"`,
      };
      let result: Record[];

      beforeEach(async () => {
        const records = [];
        for (let i = 1; i <= 500; i++) {
          records.push({
            $id: {
              type: "__ID__",
              value: i.toString(),
            },
          });
        }
        mockClient.mockResponse({ records });
        mockClient.mockResponse({
          records: [{ $id: { type: "__ID__", value: "501" } }],
        });
        result = await recordClient.getAllRecordsWithOffset<Record>(params);
      });

      it("should return all records", () => {
        expect(mockClient.getLogs()[0]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: `${params.condition} limit 500 offset 0`,
          },
        });
        expect(mockClient.getLogs()[1]).toEqual({
          path: "/k/v1/records.json",
          method: "get",
          params: {
            app: params.app,
            fields: params.fields,
            query: `${params.condition} limit 500 offset 500`,
          },
        });

        expect(result.length).toBe(501);
        expect(result[500]).toStrictEqual({
          $id: { type: "__ID__", value: "501" },
        });
      });
    });
  });

  describe("getAllRecords", () => {
    describe("`orderBy` is specified", () => {
      const params = {
        app: APP_ID,
        condition: `${fieldCode} = "foo"`,
        orderBy: `${fieldCode} asc`,
      };
      let withCursorMockFn: jest.Mock;
      let withOffsetMockFn: jest.Mock;
      beforeEach(() => {
        withCursorMockFn = jest.fn();
        withOffsetMockFn = jest.fn();
        recordClient.getAllRecordsWithCursor = withCursorMockFn;
        recordClient.getAllRecordsWithOffset = withOffsetMockFn;
      });
      it("should call `getAllRecordsWithCursor` if `withCursor` is not specified", async () => {
        await recordClient.getAllRecords({ ...params });
        expect(withCursorMockFn.mock.calls.length).toBe(1);
        expect(withCursorMockFn.mock.calls[0][0]).toStrictEqual({
          app: params.app,
          query: `${params.condition} order by ${params.orderBy}`,
        });
      });
      it("should call `getAllRecordsWithCursor` if `withCursor` is true", async () => {
        await recordClient.getAllRecords({ ...params, withCursor: true });
        expect(withCursorMockFn.mock.calls.length).toBe(1);
        expect(withCursorMockFn.mock.calls[0][0]).toStrictEqual({
          app: params.app,
          query: `${params.condition} order by ${params.orderBy}`,
        });
      });
      it("should call `getAllRecordsWithOffset` if `withCursor` is false", async () => {
        await recordClient.getAllRecords({ ...params, withCursor: false });
        expect(withOffsetMockFn.mock.calls.length).toBe(1);
        expect(withOffsetMockFn.mock.calls[0][0]).toStrictEqual(params);
      });
    });

    describe("`orderBy` is an empty string", () => {
      const params = {
        app: APP_ID,
        condition: `${fieldCode} = "foo"`,
        orderBy: "",
      };
      const { orderBy, ...expected } = params;
      let mockFn: jest.Mock;
      beforeEach(() => {
        mockFn = jest.fn();
        recordClient.getAllRecordsWithId = mockFn;
      });
      it("should call `getAllRecordsWithId` if `withCursor` is not specified", async () => {
        await recordClient.getAllRecords(params);
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(expected);
      });
      it("should call `getAllRecordsWithId` if `withCursor` is true", async () => {
        await recordClient.getAllRecords({ ...params, withCursor: true });
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(expected);
      });
      it("should call `getAllRecordsWithId` if `withCursor` is false", async () => {
        await recordClient.getAllRecords({ ...params, withCursor: false });
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(expected);
      });
    });
    describe("`orderBy` is not specified", () => {
      const params = {
        app: APP_ID,
        condition: `${fieldCode} = "foo"`,
      };
      let mockFn: jest.Mock;
      beforeEach(() => {
        mockFn = jest.fn();
        recordClient.getAllRecordsWithId = mockFn;
      });
      it("should call `getAllRecordsWithId` if `withCursor` is not specified", async () => {
        await recordClient.getAllRecords(params);
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(params);
      });
      it("should call `getAllRecordsWithId` if `withCursor` is true", async () => {
        await recordClient.getAllRecords({ ...params, withCursor: true });
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(params);
      });
      it("should call `getAllRecordsWithId` if `withCursor` is false", async () => {
        await recordClient.getAllRecords({ ...params, withCursor: false });
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toStrictEqual(params);
      });
    });
  });

  describe("getAllRecordsWithCursor", () => {
    const params = {
      app: APP_ID,
      fields: [fieldCode],
      query: `${fieldCode} = "foo"`,
    };
    const CURSOR_ID = "1";
    let result: Record[];

    describe("success", () => {
      beforeEach(async () => {
        // response from createCursor
        mockClient.mockResponse({ id: CURSOR_ID, totalCount: "4" });
        // response from getRecordsByCursor
        mockClient.mockResponse({
          records: [
            { $id: { type: "__ID__", value: "1" } },
            { $id: { type: "__ID__", value: "2" } },
          ],
          next: true,
        });
        mockClient.mockResponse({
          records: [
            { $id: { type: "__ID__", value: "3" } },
            { $id: { type: "__ID__", value: "4" } },
          ],
          next: false,
        });
        result = await recordClient.getAllRecordsWithCursor<Record>(params);
      });

      it("should create a cursor", () => {
        expect(mockClient.getLogs()[0]).toEqual({
          path: "/k/v1/records/cursor.json",
          method: "post",
          params,
        });
      });

      it("should return all records", () => {
        expect(mockClient.getLogs()[1]).toEqual({
          path: "/k/v1/records/cursor.json",
          method: "get",
          params: { id: CURSOR_ID },
        });
        expect(mockClient.getLogs()[2]).toEqual({
          path: "/k/v1/records/cursor.json",
          method: "get",
          params: { id: CURSOR_ID },
        });
        expect(result).toStrictEqual([
          { $id: { type: "__ID__", value: "1" } },
          { $id: { type: "__ID__", value: "2" } },
          { $id: { type: "__ID__", value: "3" } },
          { $id: { type: "__ID__", value: "4" } },
        ]);
      });

      it("should not call deleteCursor", () => {
        expect(mockClient.getLogs().length).toEqual(3);
      });
    });

    describe("failure", () => {
      beforeEach(() => {
        // response from createCursor
        mockClient.mockResponse({ id: CURSOR_ID, totalCount: "4" });
        // response from getRecordsByCursor
        mockClient.mockResponse({
          records: [{ id: 1 }, { id: 2 }],
          next: true,
        });
        mockClient.mockResponse(new Error("failed"));
      });

      it("should raise error", async () => {
        await expect(
          recordClient.getAllRecordsWithCursor<Record>(params),
        ).rejects.toThrow("failed");
        expect(mockClient.getLogs()[3]).toStrictEqual({
          path: "/k/v1/records/cursor.json",
          method: "delete",
          params: { id: CURSOR_ID },
        });
      });
    });
  });

  describe("addAllRecords", () => {
    const params = {
      app: APP_ID,
      records: Array.from({ length: 3000 }, (_, index) => index + 1).map(
        (value) => ({
          [fieldCode]: {
            value,
          },
        }),
      ),
    };
    let response: any;
    describe("success", () => {
      const mockResponse = {
        results: Array.from({ length: 20 }, (_, index) => index + 1).map(
          () => ({
            ids: Array.from({ length: 100 }, (_, index) => index + 1),
            revisions: Array.from({ length: 100 }, () => 1),
          }),
        ),
      };
      const mockResponse2 = {
        results: Array.from({ length: 10 }, (_, index) => index + 1).map(
          () => ({
            ids: Array.from({ length: 100 }, (_, index) => index + 1),
            revisions: Array.from({ length: 100 }, () => 1),
          }),
        ),
      };
      beforeEach(async () => {
        // response from first call of bulkRequest.send
        mockClient.mockResponse(mockResponse);
        // response from second call of bulkRequest.send
        mockClient.mockResponse(mockResponse2);
        response = await recordClient.addAllRecords(params);
      });
      it("should call bulkRequest multiple times", () => {
        expect(mockClient.getLogs().length).toBe(2);
      });

      it("should return merged result of each bulkRequest's result", () => {
        const accumulateResponse = (
          acc: Array<{ id: number; revision: number }>,
          { ids, revisions }: { ids: number[]; revisions: number[] },
        ) =>
          acc.concat(
            ids.map((id, index) => ({
              id,
              revision: revisions[index],
            })),
          );

        const expected = [
          ...mockResponse.results.reduce(accumulateResponse, []),
          ...mockResponse2.results.reduce(accumulateResponse, []),
        ];
        expect(response.records).toStrictEqual(expected);
      });
    });

    describe("parameter error", () => {
      it("should raise an Error if `records` parameter is not an array", async () => {
        const invalidParams: any = {
          app: APP_ID,
          records: Array.from({ length: 3000 }, (_, index) => index + 1).map(
            (value) => {
              if (value === 1000) {
                return value;
              }
              return {
                [fieldCode]: {
                  value,
                },
              };
            },
          ),
        };
        await expect(recordClient.addAllRecords(invalidParams)).rejects.toThrow(
          "the `records` parameter must be an array of object.",
        );
      });
    });
    describe("response error", () => {
      // success
      const mockResponse = {
        results: Array.from({ length: 20 }, (_, index) => index + 1).map(
          () => ({
            ids: Array.from({ length: 100 }, (_, index) => index + 1),
            revisions: Array.from({ length: 100 }, () => 1),
          }),
        ),
      };
      // failed
      const errorResponse = {
        data: {
          results: [
            {},
            {},
            {
              id: "some id",
              code: "some code",
              message: "some error message",
              errors: {
                [`records[5].Customer`]: {
                  messages: ["key is missing"],
                },
              },
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
        },
        status: 500,
        statusText: "Internal Server Error",
        headers: {
          "X-Some-Header": "error",
        },
      };
      beforeEach(async () => {
        mockClient.mockResponse(mockResponse);
        mockClient.mockResponse(new KintoneRestAPIError(errorResponse));
      });
      it("should raise an KintoneAllRecordsError if an error occurs during bulkRequest", async () => {
        await expect(recordClient.addAllRecords(params)).rejects.toBeInstanceOf(
          KintoneAllRecordsError,
        );
      });
    });
  });

  describe("updateAllRecords", () => {
    const params = {
      app: APP_ID,
      upsert: false,
      records: Array.from({ length: 3000 }, (_, index) => index + 1).map(
        (value) => ({
          id: value,
          record: {
            [fieldCode]: {
              value: `${fieldCode}-${value}`,
            },
          },
          revision: 1,
        }),
      ),
    };
    let response: any;
    describe("success", () => {
      const mockResponse = {
        results: Array.from({ length: 20 }, (_, index) => index).map(
          (value) => ({
            records: Array.from({ length: 100 }, (_, index) =>
              String(value * 100 + index + 1),
            ).map((id) => ({
              id,
              revision: "2",
            })),
          }),
        ),
      };
      const mockResponse2 = {
        results: Array.from({ length: 10 }, (_, index) => index).map(
          (value) => ({
            records: Array.from({ length: 100 }, (_, index) =>
              String(2000 + value * 100 + index + 1),
            ).map((id) => ({
              id,
              revision: "2",
            })),
          }),
        ),
      };
      beforeEach(async () => {
        // response from first call of bulkRequest.send
        mockClient.mockResponse(mockResponse);
        // response from second call of bulkRequest.send
        mockClient.mockResponse(mockResponse2);
        response = await recordClient.updateAllRecords(params);
      });
      it("should call bulkRequest multiple times", () => {
        expect(mockClient.getLogs().length).toBe(2);
      });

      it("should return merged result of each bulkRequest's result", () => {
        const accumulateResponse = (
          acc: Array<{ id: string; revision: string }>,
          result: { records: Array<{ id: string; revision: string }> },
        ) => {
          return acc.concat(result.records);
        };

        const expected = [
          ...mockResponse.results,
          ...mockResponse2.results,
        ].reduce(accumulateResponse, []);
        expect(response.records).toStrictEqual(expected);
      });
    });

    describe("response error", () => {
      // success
      const mockResponse = {
        results: Array.from({ length: 20 }, (_, index) => index).map(
          (value) => ({
            records: Array.from({ length: 100 }, (_, index) =>
              String(value * 100 + index + 1),
            ).map((id) => ({
              id,
              revision: "2",
            })),
          }),
        ),
      };
      // failed
      const errorResponse = {
        data: {
          results: [
            {},
            {},
            {
              id: "some id",
              code: "some code",
              message: "some error message",
              errors: {
                [`records[5].Customer`]: {
                  messages: ["key is missing"],
                },
              },
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
        },
        status: 500,
        statusText: "Internal Server Error",
        headers: {
          "X-Some-Header": "error",
        },
      };
      beforeEach(async () => {
        mockClient.mockResponse(mockResponse);
        mockClient.mockResponse(new KintoneRestAPIError(errorResponse));
      });
      it("should raise an KintoneAllRecordsError if an error occurs during bulkRequest", async () => {
        await expect(
          recordClient.updateAllRecords(params),
        ).rejects.toBeInstanceOf(KintoneAllRecordsError);
      });
    });
  });

  describe("deleteAllRecords", () => {
    const params = {
      app: APP_ID,
      records: Array.from({ length: 3000 }, (_, index) => index + 1).map(
        (value) => ({
          id: value,
          revision: 1,
        }),
      ),
    };
    let response: any;
    describe("success", () => {
      const mockResponse = {
        results: Array.from({ length: 20 }, () => ({})),
      };
      const mockResponse2 = {
        results: Array.from({ length: 10 }, () => ({})),
      };
      beforeEach(async () => {
        // response from first call of bulkRequest.send
        mockClient.mockResponse(mockResponse);
        // response from second call of bulkRequest.send
        mockClient.mockResponse(mockResponse2);
        response = await recordClient.deleteAllRecords(params);
      });
      it("should call bulkRequest multiple times", () => {
        expect(mockClient.getLogs().length).toBe(2);
      });

      it("should return an empty object", () => {
        expect(response).toStrictEqual({});
      });
    });

    describe("response error", () => {
      // success
      const mockResponse = {
        results: Array.from({ length: 20 }, () => ({})),
      };
      // failed
      const errorResponse = {
        data: {
          results: [
            {},
            {},
            {
              id: "some id",
              code: "some code",
              message: "some error message",
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
        },
        status: 500,
        statusText: "Internal Server Error",
        headers: {
          "X-Some-Header": "error",
        },
      };
      beforeEach(async () => {
        mockClient.mockResponse(mockResponse);
        mockClient.mockResponse(new KintoneRestAPIError(errorResponse));
      });
      it("should raise an KintoneAllRecordsError if an error occurs during bulkRequest", async () => {
        await expect(
          recordClient.deleteAllRecords(params),
        ).rejects.toBeInstanceOf(KintoneAllRecordsError);
      });
    });
  });
});
