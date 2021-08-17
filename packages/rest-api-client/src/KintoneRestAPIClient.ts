import { BulkRequestClient, EndpointName } from "./client/BulkRequestClient";
import { AppClient } from "./client/AppClient";
import { RecordClient } from "./client/RecordClient";
import { FileClient } from "./client/FileClient";
import { DefaultHttpClient } from "./http/";
import { ProxyConfig } from "./http/HttpClientInterface";
import { BasicAuth, DiscriminatedAuth } from "./types/auth";
import { KintoneRequestConfigBuilder } from "./KintoneRequestConfigBuilder";
import { KintoneResponseHandler } from "./KintoneResponseHandler";
import { platformDeps } from "./platform/index";
import { UnsupportedPlatformError } from "./platform/UnsupportedPlatformError";

type OmitTypePropertyFromUnion<T> = T extends unknown ? Omit<T, "type"> : never;
type Auth = OmitTypePropertyFromUnion<DiscriminatedAuth>;

type Options = {
  baseUrl?: string;
  auth?: Auth;
  guestSpaceId?: number | string;
  basicAuth?: BasicAuth;
  clientCertAuth?:
    | {
        pfx: Buffer;
        password: string;
      }
    | {
        pfxFilePath: string;
        password: string;
      };
  proxy?: ProxyConfig;
  featureFlags?: {
    enableAbortSearchError: boolean;
  };
  userAgent?: string;
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
        `session authentication is not supported in ${e.platform} environment.`
      );
    }
    throw e;
  }
};

export class KintoneRestAPIClient {
  record: RecordClient;
  app: AppClient;
  file: FileClient;
  private bulkRequest_: BulkRequestClient;
  private baseUrl?: string;

  constructor(options: Options = {}) {
    validateOptions(options);

    this.baseUrl = platformDeps.buildBaseUrl(options.baseUrl);

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
    this.file = new FileClient(httpClient, guestSpaceId);
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
  validateGuestSpaceId(options.guestSpaceId);
};

const validateGuestSpaceId = (guestSpaceId: Options["guestSpaceId"]) => {
  if (guestSpaceId === "" || guestSpaceId === null) {
    throw new Error(`invalid guestSpaceId: got [${guestSpaceId}]`);
  }
};
