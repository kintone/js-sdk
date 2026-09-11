import http from "node:http";
import type { AddressInfo } from "node:net";

export type CapturedRawRequest = {
  method: string;
  path: string;
  headers: http.IncomingHttpHeaders;
  body: Buffer;
};

type QueuedResponse =
  | { kind: "json"; status: number; body: unknown }
  | { kind: "redirect"; status: number; location: string };

/**
 * A real node:http server, not msw. msw's fetch interceptor (followFetchRedirect
 * in @mswjs/interceptors) unconditionally rejects any 307/308 redirect on a
 * request that carries a body, regardless of whether the underlying source is
 * a re-readable Buffer -- see FileUploadRedirect.http.test.ts. A real server is
 * the only way to observe undici's actual (correct) resend behavior for that
 * case.
 */
export class RedirectTestServer {
  private readonly server = http.createServer((req, res) =>
    this.handle(req, res),
  );
  private logs: CapturedRawRequest[] = [];
  private responseQueue: QueuedResponse[] = [];
  public baseUrl = "";

  public async listen(): Promise<void> {
    await new Promise<void>((resolve) =>
      this.server.listen(0, "127.0.0.1", resolve),
    );
    const address = this.server.address() as AddressInfo;
    this.baseUrl = `http://127.0.0.1:${address.port}`;
  }

  public mockRedirectResponse(location: string, status: number): void {
    this.responseQueue.push({ kind: "redirect", status, location });
  }

  public mockResponse(body: unknown, status = 200): void {
    this.responseQueue.push({ kind: "json", status, body });
  }

  public getLogs(): CapturedRawRequest[] {
    return this.logs;
  }

  public close(): void {
    this.server.close();
  }

  private handle(req: http.IncomingMessage, res: http.ServerResponse): void {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      this.logs.push({
        method: (req.method ?? "").toLowerCase(),
        path: req.url ?? "",
        headers: req.headers,
        body: Buffer.concat(chunks),
      });

      const next = this.responseQueue.shift() ?? {
        kind: "json" as const,
        status: 200,
        body: {},
      };
      if (next.kind === "redirect") {
        res.writeHead(next.status, { Location: next.location });
        res.end();
        return;
      }
      res.writeHead(next.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(next.body));
    });
  }
}
