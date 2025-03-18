/* eslint-disable n/no-unsupported-features/node-builtins */
import type { Middleware, MiddlewareCallbackParams } from "openapi-fetch";
import { platformDeps } from "../../platform";

export const getCsrfMiddleware = (): Middleware => {
  return {
    async onRequest({ request }: MiddlewareCallbackParams) {
      const body: any = await request.json();

      body.__REQUEST_TOKEN__ = await platformDeps.getRequestToken();
      return new Request(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(body),
      });
    },
  };
};
