/* eslint-disable n/no-unsupported-features/node-builtins */
import type { Middleware, MiddlewareCallbackParams } from "openapi-fetch";
import { platformDeps } from "../../platform/index.js";

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
          formData.append(
            "__REQUEST_TOKEN__",
            await platformDeps.getRequestToken(),
          );
        }
        return new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: formData,
        });
      }

      const body = (await request.json()) as Record<string, unknown>;
      body.__REQUEST_TOKEN__ = await platformDeps.getRequestToken();
      return new Request(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(body),
      });
    },
  };
};
