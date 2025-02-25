/* eslint-disable n/no-unsupported-features/node-builtins */
import type { Middleware, MiddlewareCallbackParams } from "openapi-fetch";

export const getCsrfMiddleware = (): Middleware => {
  return {
    async onRequest({ request }: MiddlewareCallbackParams) {
      const body: any = await request.json();

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
