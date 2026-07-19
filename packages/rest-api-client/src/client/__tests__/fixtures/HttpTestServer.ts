import { randomUUID } from "crypto";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import qs from "qs";

/** One part of a multipart/form-data request body. */
export type CapturedFormDataPart =
  | { kind: "file"; filename: string; content: string }
  | { kind: "field"; content: string };

export type CapturedRequest = {
  method: string;
  path: string;
  /** Query string parsed with the same `qs` library used to build it. Values on the wire are always strings. */
  query: Record<string, any>;
  headers: Record<string, string>;
  /**
   * Parsed JSON body, a `{[fieldName]: CapturedFormDataPart}` map for multipart/form-data
   * bodies, the raw string if it's neither, or undefined if the body was empty.
   */
  body: any;
};

type QueuedResponse =
  | { kind: "json"; status: number; body: unknown }
  | { kind: "binary"; status: number; body: Uint8Array | Buffer };

/**
 * Intercepts real outgoing HTTP requests (msw patches Node's http/https module,
 * and also global fetch) so these tests assert on the actual bytes AppClient sends
 * over the wire, not on calls to an internal mock client. That keeps them valid
 * regardless of which HttpClient implementation is underneath (Axios today, fetch later).
 */
export class HttpTestServer {
  // Unique per instance so concurrently-running test files/instances can never
  // have their requests cross-routed to each other's msw handler.
  public readonly baseUrl = `https://${randomUUID()}.example.cybozu.com`;
  private readonly server = setupServer(
    http.all(`${this.baseUrl}/*`, async ({ request }) => {
      const url = new URL(request.url);
      const contentType = request.headers.get("content-type") ?? "";
      // msw can re-read the request body internally (e.g. during unhandled-request
      // detection), so clone before consuming it to avoid "Body has already been read".
      const body = contentType.startsWith("multipart/form-data")
        ? await parseFormDataBody(request.clone())
        : await parseTextBody(request.clone());

      this.logs.push({
        method: request.method.toLowerCase(),
        path: url.pathname,
        query: qs.parse(url.search.replace(/^\?/, "")),
        headers: Object.fromEntries(request.headers),
        body,
      });

      const next = this.responseQueue.shift() ?? {
        kind: "json",
        status: 200,
        body: {},
      };
      return next.kind === "binary"
        ? new HttpResponse(next.body, { status: next.status })
        : HttpResponse.json(next.body, { status: next.status });
    }),
  );
  private logs: CapturedRequest[] = [];
  private responseQueue: QueuedResponse[] = [];

  public listen(): void {
    this.server.listen({ onUnhandledRequest: "error" });
  }

  public mockResponse(body: unknown, status = 200): void {
    this.responseQueue.push({ kind: "json", status, body });
  }

  public mockBinaryResponse(body: Uint8Array | Buffer, status = 200): void {
    this.responseQueue.push({ kind: "binary", status, body });
  }

  public getLogs(): CapturedRequest[] {
    return this.logs;
  }

  public reset(): void {
    this.logs = [];
    this.responseQueue = [];
  }

  public close(): void {
    this.server.close();
  }
}

/**
 * Normalizes a params object the same way it would come back off a query string
 * (qs.stringify -> wire -> qs.parse), so GET/DELETE assertions can compare against
 * the real wire representation instead of the original typed object.
 */
export const wireParams = (params: Record<string, any>) =>
  qs.parse(qs.stringify(params));

// Typed structurally (rather than as the global `Request`/`FormData`) since
// referencing those identifiers directly trips the lint rule guarding against
// unsupported Node builtins, even though this is a type-only usage of the
// Fetch API objects msw hands us.
type FormDataEntryLike = string | { name: string; text: () => Promise<string> };
type FormDataLike = {
  entries: () => IterableIterator<[string, FormDataEntryLike]>;
};
type ReadableHttpMessage = {
  text: () => Promise<string>;
  formData: () => Promise<FormDataLike>;
};

const parseTextBody = async (request: ReadableHttpMessage): Promise<any> => {
  const rawBody = await request.text();
  if (rawBody.length === 0) {
    return undefined;
  }
  try {
    return JSON.parse(rawBody);
  } catch {
    return rawBody;
  }
};

const parseFormDataBody = async (
  request: ReadableHttpMessage,
): Promise<Record<string, CapturedFormDataPart>> => {
  const formData = await request.formData();
  const parts: Record<string, CapturedFormDataPart> = {};
  for (const [name, value] of formData.entries()) {
    parts[name] =
      typeof value === "string"
        ? { kind: "field", content: value }
        : { kind: "file", filename: value.name, content: await value.text() };
  }
  return parts;
};
