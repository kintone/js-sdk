import { SetRequired } from "type-fest";
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

export type HTTPClientParams = {
  __REQUEST_TOKEN__?: string;
};

export type Auth =
  | Omit<ApiTokenAuth, "type">
  | Omit<PasswordAuth, "type">
  | Omit<SessionAuth, "type">
  | Omit<OAuthTokenAuth, "type">;

export type ApiTokenAuth = {
  type: "apiToken";
  apiToken: string | string[];
};

export type PasswordAuth = {
  type: "password";
  username: string;
  password: string;
};

export type SessionAuth = {
  type: "session";
};

export type OAuthTokenAuth = {
  type: "oAuthToken";
  oAuthToken: string;
};

export type BasicAuth = {
  username: string;
  password: string;
};

export type KintoneAuthHeader =
  | {
      "X-Cybozu-Authorization": string;
      Authorization?: string;
    }
  | {
      "X-Cybozu-API-Token": string;
      Authorization?: string;
    }
  | {
      "X-Requested-With": "XMLHttpRequest";
      Authorization?: string;
    }
  | {
      Authorization: string;
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

export class KintoneRestAPIClient {
  record: RecordClient;
  app: AppClient;
  file: FileClient;
  private bulkRequest_: BulkRequestClient;
  private baseUrl?: string;

  constructor(options: Options = {}) {
    options.baseUrl = this.baseUrl = options.baseUrl ?? location?.origin;
    assertsOptions(options);
    const requestConfigBuilder = new KintoneRequestConfigBuilder(options);
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

function assertsOptions(
  options: Options
): asserts options is SetRequired<Options, "baseUrl"> {
  if (typeof options.baseUrl !== "string") {
    throw new Error("in Node.js environment, baseUrl is required");
  }
}
