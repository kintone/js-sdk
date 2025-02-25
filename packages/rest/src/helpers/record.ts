import type { paths } from "../schemas/schema";
import type { Client } from "openapi-fetch";

export const record = (client: Client<paths>) => {
  return {
    getRecord: async <T>(params: {
      app: string;
      id: string;
    }): Promise<{ record: T }> => {
      const { data, error } = await client.GET("/k/v1/record.json", {
        params: {
          query: params,
        },
      });
      if (error) {
        throw error;
      }
      return { record: data.record as T };
    },
  };
};
