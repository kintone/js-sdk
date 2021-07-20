import axios, {
  AxiosInstance,
  AxiosProxyConfig,
  AxiosRequestConfig,
} from "axios";
import { IncomingHttpHeaders } from "http";

export interface NewInstanceInput {
  baseUrl: string;
  username: string | null;
  password: string | null;
  oAuthToken: string | null;
  apiToken: string | null;
  proxy: string | null;
  proxyHost: string | null;
  proxyPort: string | null;
  basicAuthPassword: string | null;
  basicAuthUsername: string | null;
}

const newAxiosInstance = (input: NewInstanceInput): AxiosInstance => {
  let proxy: AxiosProxyConfig | undefined;
  // parse the proxy URL like http://admin:pass@localhost:8000
  if (input.proxy) {
    const proxyUrl = new URL(input.proxy);
    proxy = {
      host: proxyUrl.hostname,
      port: parseInt(proxyUrl.port, 10),
      auth: {
        username: proxyUrl.username,
        password: proxyUrl.password,
      },
    };
  } else if (input.proxyHost !== null && input.proxyPort !== null) {
    proxy = {
      host: input.proxyHost,
      port: parseInt(input.proxyPort, 10),
    };
  }

  let headers: IncomingHttpHeaders;
  if (input.username && input.password) {
    headers = {
      "X-Cybozu-Authorization": Buffer.from(
        `${input.username}:${input.password}`
      ).toString("base64"),
    };
  } else if (input.apiToken) {
    headers = {
      "X-Cybozu-API-Token": input.apiToken,
    };
  } else if (input.oAuthToken) {
    headers = {
      Authorization: `Bearer ${input.oAuthToken}`,
    };
  } else {
    throw new Error("cannot get an authentication input");
  }

  if (input.basicAuthPassword && input.basicAuthPassword) {
    headers.Authorization =
      "Basic " +
      Buffer.from(
        `${input.basicAuthUsername}:${input.basicAuthPassword}`
      ).toString("base64");
  }
  return VisibleForTesting.newAxiosInstanceInternal({
    baseURL: input.baseUrl,
    headers,
    proxy,
  });
};

const newAxiosInstanceInternal = (config: AxiosRequestConfig) => {
  return axios.create(config);
};

export const AxiosUtils = {
  newAxiosInstance,
};

export const VisibleForTesting = {
  newAxiosInstanceInternal,
};
