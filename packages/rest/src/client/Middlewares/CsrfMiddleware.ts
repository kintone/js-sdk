/* eslint-disable n/no-unsupported-features/node-builtins */
import type { Middleware, MiddlewareCallbackParams } from "openapi-fetch";

export const getCsrfMiddleware = (): Middleware => {
  return {
    async onRequest({ request }: MiddlewareCallbackParams) {
      if (request.method === "GET") {
        return request;
      }

      if (
        request.headers.get("content-type")?.includes("multipart/form-data")
      ) {
        const formData = await request.formData();
        if (!formData.has("__REQUEST_TOKEN__")) {
          formData.append("__REQUEST_TOKEN__", await getRequestToken());
        }
        return new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: formData,
        });
      }

      const body = (await request.json()) as Record<string, unknown>;
      body.__REQUEST_TOKEN__ = await getRequestToken();
      return new Request(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(body),
      });
    },
  };
};

declare let kintone: any;
const getRequestToken = async () => {
  if (
    typeof kintone === "object" &&
    kintone !== null &&
    typeof kintone.getRequestToken === "function"
  ) {
    return kintone.getRequestToken();
  }

  throw new Error("session authentication must specify a request token");
};
