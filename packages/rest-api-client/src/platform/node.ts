import fs from "node:fs";
import { promisify } from "node:util";
import { basename } from "node:path";
import { UnsupportedPlatformError } from "./UnsupportedPlatformError";
import type https from "node:https";
import os from "node:os";
import { Agent, ProxyAgent, fetch as undiciFetch } from "undici";
import type { ProxyConfig } from "../http/HttpClientInterface";
import type FormData from "form-data";
import packageJson from "../../package.json";

const readFile = promisify(fs.readFile);

type ClientCertAuth =
  | {
      pfx: Buffer;
      password: string;
    }
  | {
      pfxFilePath: string;
      password: string;
    };

export const readFileFromPath = async (filePath: string) => {
  const data = await readFile(filePath);
  const name = basename(filePath);
  return { data, name };
};

export const getRequestToken = () => {
  throw new UnsupportedPlatformError("Node.js");
};

export const getDefaultAuth = () => {
  throw new UnsupportedPlatformError("Node.js");
};

export const buildHeaders = (params: { userAgent?: string }) => {
  const { userAgent } = params;
  return {
    "User-Agent": `Node.js/${process.version}(${os.type()}) ${
      packageJson.name
    }@${packageJson.version}${userAgent ? ` ${userAgent}` : ""}`,
  };
};

export const buildFormDataValue = (data: unknown) => {
  return data;
};

export const buildBaseUrl = (baseUrl: string | undefined) => {
  if (typeof baseUrl === "undefined") {
    throw new Error("in Node.js environment, baseUrl is required");
  }
  return baseUrl;
};

export const getVersion = () => {
  return packageJson.version;
};

export const buildFetchFormData = async (
  data: unknown,
): Promise<{ body: unknown; contentType?: string } | null> => {
  if (
    !data ||
    typeof data !== "object" ||
    !("getBuffer" in data && typeof (data as any).getBuffer === "function") ||
    !("getBoundary" in data && typeof (data as any).getBoundary === "function")
  ) {
    return null;
  }
  const fd = data as FormData;
  return {
    // `fd.getBuffer()` throws if any appended field is a Stream (e.g. a
    // `fs.createReadStream()` passed as `file.data`, which docs/file.md
    // documents as supported). Drain the FormData's own "data"/"end" events
    // into a Buffer ourselves instead, so a Stream field no longer crashes.
    // A Buffer (rather than a ReadableStream) also keeps the body resendable
    // if the server issues a redirect, and lets fetch set Content-Length.
    body: await bufferFormData(fd),
    contentType: `multipart/form-data; boundary=${fd.getBoundary()}`,
  };
};

const bufferFormData = (formData: FormData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    formData.on("data", (chunk: Buffer | string) => {
      // Text fields can come through as plain strings rather than Buffers.
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    });
    formData.on("end", () => resolve(Buffer.concat(chunks)));
    formData.on("error", reject);
    // `form-data` (built on `combined-stream`) only starts flowing once
    // explicitly resumed - unlike modern Readable streams, attaching a
    // "data" listener alone does not start the flow.
    formData.resume();
  });
};

export const buildFetchDispatcher = ({
  httpsAgent,
  clientCertAuth,
  proxy,
  socketTimeout,
}: {
  httpsAgent?: unknown;
  clientCertAuth?: unknown;
  proxy?: ProxyConfig;
  socketTimeout?: number;
}): unknown => {
  const resolvedHttpsAgent = httpsAgent as https.Agent | undefined;
  const tlsOptions = buildTlsOptions({
    httpsAgent: resolvedHttpsAgent,
    clientCertAuth: clientCertAuth as ClientCertAuth | undefined,
  });
  const connectionOptions = buildAgentConnectionOptions(resolvedHttpsAgent);

  // Proxy configuration (proxy can be false to explicitly disable)
  if (proxy && typeof proxy === "object") {
    return buildProxyDispatcher(proxy, tlsOptions, socketTimeout);
  }

  // A caller-supplied httpsAgent must always produce a dispatcher, even if
  // none of its options translate into undici Agent options: falling back to
  // Node's global fetch would silently drop the whole agent rather than just
  // the untranslatable parts of it.
  if (tlsOptions || socketTimeout || connectionOptions || resolvedHttpsAgent) {
    return new Agent({
      connect: tlsOptions || {},
      connectTimeout: socketTimeout,
      ...connectionOptions,
    });
  }

  return undefined;
};

// undici's Agent has no on/off keep-alive toggle (`keepAlive` is unsupported;
// the closest analog, `pipelining`, is a different concept), so only
// `maxSockets` has a direct equivalent: `connections`, the max concurrent
// connections per origin.
export const buildAgentConnectionOptions = (
  httpsAgent: https.Agent | undefined,
): { connections: number } | undefined => {
  const maxSockets = httpsAgent?.options?.maxSockets;
  return typeof maxSockets === "number"
    ? { connections: maxSockets }
    : undefined;
};

// Node's global fetch is backed by whichever undici version ships with that
// Node release (e.g. undici 6.x on Node 22, 7.x on Node 24), which can be
// older than this package's own `undici` dependency. Handing an
// Agent/ProxyAgent built from this package's `undici` to Node's global fetch
// mixes two undici versions, and their internal Dispatcher/Handler protocols
// aren't guaranteed to be compatible (observed: "invalid onRequestStart
// method" from the TLS Agent path, and a silent hang from the ProxyAgent
// path). Routing dispatcher-bearing requests through this package's own
// `undici.fetch` keeps fetch() and the Agent on the same version.
export const fetchWithDispatcher = (
  url: string,
  options: RequestInit & { dispatcher?: unknown },
): Promise<unknown> => undiciFetch(url as any, options as any);

const buildProxyDispatcher = (
  proxy: Exclude<ProxyConfig, false | undefined>,
  tlsOptions: Record<string, unknown> | undefined,
  socketTimeout?: number,
): ProxyAgent => {
  const proxyUrl = buildProxyUrl(proxy);

  return new ProxyAgent({
    uri: proxyUrl,
    requestTls: tlsOptions,
    connectTimeout: socketTimeout,
  });
};

const buildProxyUrl = (
  proxy: Exclude<ProxyConfig, false | undefined>,
): string => {
  const protocol = proxy.protocol ?? "http";
  const auth = proxy.auth
    ? `${encodeURIComponent(proxy.auth.username)}:${encodeURIComponent(proxy.auth.password)}@`
    : "";
  return `${protocol}://${auth}${proxy.host}:${proxy.port}`;
};

const buildTlsOptions = ({
  httpsAgent,
  clientCertAuth,
}: {
  httpsAgent?: https.Agent;
  clientCertAuth?: ClientCertAuth;
}): Record<string, unknown> | undefined => {
  // Extract TLS options from existing httpsAgent for compatibility
  if (httpsAgent) {
    const options = httpsAgent.options || {};
    const tlsOptions: Record<string, unknown> = {};

    if (options.pfx) {
      tlsOptions.pfx = options.pfx;
    }
    if (options.passphrase) {
      tlsOptions.passphrase = options.passphrase;
    }
    if (options.cert) {
      tlsOptions.cert = options.cert;
    }
    if (options.key) {
      tlsOptions.key = options.key;
    }
    if (options.ca) {
      tlsOptions.ca = options.ca;
    }
    if (options.rejectUnauthorized !== undefined) {
      tlsOptions.rejectUnauthorized = options.rejectUnauthorized;
    }

    return Object.keys(tlsOptions).length > 0 ? tlsOptions : undefined;
  }

  // Build TLS options from clientCertAuth
  if (clientCertAuth) {
    const pfx =
      "pfx" in clientCertAuth
        ? clientCertAuth.pfx
        : fs.readFileSync(clientCertAuth.pfxFilePath);

    return {
      pfx,
      passphrase: clientCertAuth.password,
    };
  }

  return undefined;
};
