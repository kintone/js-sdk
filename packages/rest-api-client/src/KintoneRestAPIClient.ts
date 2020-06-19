import { BulkRequestClient, EndpointName } from "./client/BulkRequestClient";
import { AppClient } from "./client/AppClient";
import { RecordClient } from "./client/RecordClient";
import { FileClient } from "./client/FileClient";
import { DefaultHttpClient } from "./http/";
import {
  KintoneRestAPIError,
  KintoneErrorResponse,
} from "./KintoneRestAPIError";
import {
  ErrorResponse,
  HttpClientError,
  ProxyConfig,
} from "./http/HttpClientInterface";
import { KintoneRequestConfigBuilder } from "./KintoneRequestConfigBuilder";
import { platformDeps } from "./platform/index";
import { UnsupportedPlatformError } from "./platform/UnsupportedPlatformError";

export type DiscriminatedAuth =
  | ApiTokenAuth
  | PasswordAuth
  | SessionAuth
  | OAuthTokenAuth;

type Auth =
  | Omit<ApiTokenAuth, "type">
  | Omit<PasswordAuth, "type">
  | Omit<SessionAuth, "type">
  | Omit<OAuthTokenAuth, "type">;

type ApiTokenAuth = {
  type: "apiToken";
  apiToken: string | string[];
};

type PasswordAuth = {
  type: "password";
  username: string;
  password: string;
};

type SessionAuth = {
  type: "session";
};

type OAuthTokenAuth = {
  type: "oAuthToken";
  oAuthToken: string;
};

export type BasicAuth = {
  username: string;
  password: string;
};

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
};

export const errorResponseHandler = (
  error: HttpClientError<ErrorResponse<string> | KintoneErrorResponse>
) => {
  if (!error.response) {
    // FIXME: find a better way to handle this error
    if (/mac verify failure/.test(error.toString())) {
      throw new Error("invalid clientCertAuth setting");
    }
    throw error;
  }
  const errorResponse = error.response;

  const { data, ...rest } = errorResponse;
  if (typeof data === "string") {
    throw new Error(`${rest.status}: ${rest.statusText}`);
  }
  throw new KintoneRestAPIError({ data, ...rest });
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
    this.baseUrl = platformDeps.buildBaseUrl(options.baseUrl);

    const auth = buildDiscriminatedAuth(options.auth ?? {});
    const requestConfigBuilder = new KintoneRequestConfigBuilder({
      ...options,
      baseUrl: this.baseUrl,
      auth,
    });
    const httpClient = new DefaultHttpClient({
      errorResponseHandler,
      requestConfigBuilder,
    });
    const { guestSpaceId } = options;

    this.bulkRequest_ = new BulkRequestClient(httpClient, guestSpaceId);
    this.record = new RecordClient(httpClient, this.bulkRequest_, guestSpaceId);
    this.app = new AppClient(httpClient, guestSpaceId);
    this.file = new FileClient(httpClient, guestSpaceId);
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
