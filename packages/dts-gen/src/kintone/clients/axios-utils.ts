import type {
  AxiosInstance,
  AxiosProxyConfig,
  AxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import axios, { AxiosHeaders } from "axios";

export interface NewInstanceInput {
  baseUrl: string;
  username: string | null;
  password: string | null;
  oAuthToken: string | null;
  apiToken: string | null;
  proxy: string | null;
  basicAuthPassword: string | null;
  basicAuthUsername: string | null;
}

const newAxiosInstance = (input: NewInstanceInput): AxiosInstance => {
  let proxy: AxiosProxyConfig | undefined;
  // parse the proxy URL like http://admin:pass@localhost:8000
  if (input.proxy) {
    const { protocol, hostname, port, username, password } = new URL(
      input.proxy
    );
    proxy = {
      protocol,
      host: hostname,
      port: parseInt(port, 10),
    };

    if (username.length > 0 && password.length > 0) {
      proxy.auth = {
        username,
        password,
      };
    }
  }

  const headers: AxiosRequestHeaders = new AxiosHeaders();
  if (input.username && input.password) {
    headers["X-Cybozu-Authorization"] = Buffer.from(
      `${input.username}:${input.password}`
    ).toString("base64");
  } else if (input.apiToken) {
    headers["X-Cybozu-API-Token"] = input.apiToken;
  } else if (input.oAuthToken) {
    headers.Authorization = `Bearer ${input.oAuthToken}`;
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
