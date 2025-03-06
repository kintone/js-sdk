/* eslint-disable n/no-unsupported-features/node-builtins */
import type { Middleware } from "openapi-fetch";

const THRESHOLD_AVOID_REQUEST_URL_TOO_LARGE = 4096;

export const getHttpMethodOverrideMiddleware = (): Middleware => {
  return {
    async onRequest({ request, params }) {
      if (request.method !== "GET") {
        return request;
      }
      if (request.url.length <= THRESHOLD_AVOID_REQUEST_URL_TOO_LARGE) {
        return request;
      }
      const _url = new URL(request.url);
      const body = params.query;
      const newHeaders = new Headers(request.headers);
      newHeaders.set("X-HTTP-Method-Override", "GET");
      newHeaders.set("Content-Type", "application/json");

      return new Request(_url.origin + _url.pathname, {
        method: "POST",
        headers: newHeaders,
        body: JSON.stringify(body),
      });
    },
  };
};
