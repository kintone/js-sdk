import { randomUUID } from "crypto";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import qs from "qs";

export type CapturedRequest = {
  method: string;
  path: string;
  /** Query string parsed with the same `qs` library used to build it. Values on the wire are always strings. */
  query: Record<string, any>;
  headers: Record<string, string>;
  /** Parsed JSON body, or the raw string if it isn't JSON, or undefined if the body was empty. */
  body: any;
};

type QueuedResponse = { status: number; body: unknown };

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
      // msw can re-read the request body internally (e.g. during unhandled-request
      // detection), so clone before consuming it to avoid "Body has already been read".
      const rawBody = await request.clone().text();
      let body: any;
      if (rawBody.length > 0) {
        try {
          body = JSON.parse(rawBody);
        } catch {
          body = rawBody;
        }
      }

      this.logs.push({
        method: request.method.toLowerCase(),
        path: url.pathname,
        query: qs.parse(url.search.replace(/^\?/, "")),
        headers: Object.fromEntries(request.headers),
        body,
      });

      const next = this.responseQueue.shift() ?? { status: 200, body: {} };
      return HttpResponse.json(next.body, { status: next.status });
    }),
  );
  private logs: CapturedRequest[] = [];
  private responseQueue: QueuedResponse[] = [];

  public listen(): void {
    this.server.listen({ onUnhandledRequest: "error" });
  }

  public mockResponse(body: unknown, status = 200): void {
    this.responseQueue.push({ status, body });
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
