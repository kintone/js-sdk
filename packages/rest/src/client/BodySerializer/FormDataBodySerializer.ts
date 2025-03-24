import { defaultBodySerializer } from "openapi-fetch";

export type BodySerializer = (body: unknown) => unknown;

export const getFormDataBodySerializer = (): BodySerializer => {
  return (body: unknown) => {
    if (body && typeof body === "object") {
      const obj = body as Record<string, unknown>;
      for (const key in obj) {
        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        if (obj[key] instanceof FormData) {
          return obj[key];
        }
      }
    }
    return defaultBodySerializer(body);
  };
};
