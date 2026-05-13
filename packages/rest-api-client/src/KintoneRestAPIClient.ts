import type { EndpointName } from "./client/BulkRequestClient.js";
import { BulkRequestClient } from "./client/BulkRequestClient.js";
import { AppClient } from "./client/AppClient.js";
import { RecordClient } from "./client/RecordClient.js";
import { SpaceClient } from "./client/SpaceClient.js";
import { FileClient } from "./client/FileClient.js";
import { PluginClient } from "./client/PluginClient.js";
import { DefaultHttpClient } from "./http/index.js";
import type { ProxyConfig } from "./http/HttpClientInterface.js";
import type { BasicAuth, DiscriminatedAuth } from "./types/auth.js";
import { KintoneRequestConfigBuilder } from "./KintoneRequestConfigBuilder.js";
import { KintoneResponseHandler } from "./KintoneResponseHandler.js";
import { platformDeps } from "./platform/index.js";
import { UnsupportedPlatformError } from "./platform/UnsupportedPlatformError.js";
import type { Agent as HttpsAgent } from "https";

type OmitTypePropertyFromUnion<T> = T extends unknown ? Omit<T, "type"> : never;
type Auth = OmitTypePropertyFromUnion<DiscriminatedAuth>;

type Options = {
  baseUrl?: string;
  auth?: Auth;
  guestSpaceId?: number | string;
  basicAuth?: BasicAuth;
  proxy?: ProxyConfig;
  httpsAgent?: HttpsAgent;
  clientCertAuth?:
    | {
        pfx: Buffer;
        password: string;
      }
    | {
        pfxFilePath: string;
        password: string;
      };
  featureFlags?: {
    enableAbortSearchError: boolean;
  };
  userAgent?: string;
  socketTimeout?: number;
};

const buildDiscriminatedAuth = (auth: Auth): DiscriminatedAuth => {
  if ("username" in auth) {
    return { type: "password", ...auth };
  }
  if ("apiToken" in auth) {
    return { type: "apiToken", ...auth };
  }
  if ("oAuthToken" in auth) {
    return { type: "oAuthToken", ...auth };
  }
  try {
    return platformDeps.getDefaultAuth();
  } catch (e) {
    if (e instanceof UnsupportedPlatformError) {
      throw new Error(
        `session authentication is not supported in ${e.platform} environment.`,
      );
    }
    throw e;
  }
};

export class KintoneRestAPIClient {
  record: RecordClient;
  app: AppClient;
  space: SpaceClient;
  file: FileClient;
  plugin: PluginClient;
  private bulkRequest_: BulkRequestClient;
  private baseUrl?: string;

  constructor(options: Options = {}) {
    validateOptions(options);

    this.baseUrl = platformDeps
      .buildBaseUrl(options.baseUrl)
      .replace(/\/+$/, ""); // Remove trailing slash

    const auth = buildDiscriminatedAuth(options.auth ?? {});
    const requestConfigBuilder = new KintoneRequestConfigBuilder({
      ...options,
      baseUrl: this.baseUrl,
      auth,
    });
    const responseHandler = new KintoneResponseHandler({
      enableAbortSearchError:
        options.featureFlags?.enableAbortSearchError ?? false,
    });
    const httpClient = new DefaultHttpClient({
      responseHandler,
      requestConfigBuilder,
    });
    const { guestSpaceId } = options;

    this.bulkRequest_ = new BulkRequestClient(httpClient, guestSpaceId);
    this.record = new RecordClient(httpClient, this.bulkRequest_, guestSpaceId);
    this.app = new AppClient(httpClient, guestSpaceId);
    this.space = new SpaceClient(httpClient, guestSpaceId);
    this.file = new FileClient(httpClient, guestSpaceId);
    this.plugin = new PluginClient(httpClient);
  }

  public static get version() {
    return platformDeps.getVersion();
  }

  public getBaseUrl() {
    return this.baseUrl;
  }

  public bulkRequest(params: {
    requests: Array<
      | {
          method: string;
          api: string;
          payload: object;
        }
      | {
          method: string;
          endpointName: EndpointName;
          payload: object;
        }
    >;
  }): Promise<{ results: Array<{ [K: string]: any }> }> {
    return this.bulkRequest_.send(params);
  }
}

const validateOptions = (options: Options) => {
  validateBaseUrl(options.baseUrl);
  validateGuestSpaceId(options.guestSpaceId);
  validateSocketTimeout(options.socketTimeout);
};

const validateBaseUrl = (baseUrl: Options["baseUrl"]) => {
  if (baseUrl === undefined) {
    return;
  }

  const url = new URL(baseUrl);
  if (url.hostname !== "localhost" && url.protocol !== "https:") {
    throw new Error('The protocol of baseUrl must be "https".');
  }
};

const validateGuestSpaceId = (guestSpaceId: Options["guestSpaceId"]) => {
  if (guestSpaceId === "" || guestSpaceId === null) {
    throw new Error(`invalid guestSpaceId: got [${guestSpaceId}]`);
  }
};

const validateSocketTimeout = (
  socketTimeout: Options["socketTimeout"] | string,
) => {
  if (socketTimeout === undefined) {
    return;
  }

  const number = parseFloat(socketTimeout.toString());
  if (isNaN(number) || number < 0) {
    throw new Error(`Invalid socketTimeout. Must be a positive number.`);
  }
};
