import { KintoneRestAPIClient } from "@kintone/rest-api-client";

export type RestAPIClientOptions = {
  baseUrl: string;
  username?: string;
  password?: string;
  basicAuthUsername?: string;
  basicAuthPassword?: string;
  apiToken?: string | string[];
  guestSpaceId?: string;
  pfxFilePath?: string;
  pfxFilePassword?: string;
};

const buildAuthParam = (options: RestAPIClientOptions) => {
  const passwordAuthParam = {
    username: options.username,
    password: options.password,
  };

  if (options.username) return passwordAuthParam;
  if (options.apiToken) return { apiToken: options.apiToken };
  return passwordAuthParam;
};

const buildBasicAuthParam = (options: RestAPIClientOptions) => {
  return options.basicAuthUsername && options.basicAuthPassword
    ? {
        basicAuth: {
          username: options.basicAuthUsername,
          password: options.basicAuthPassword,
        },
      }
    : {};
};

const buildClientCertAuth = (options: RestAPIClientOptions) => {
  return options.pfxFilePath && options.pfxFilePassword
    ? {
        clientCertAuth: {
          pfxFilePath: options.pfxFilePath,
          password: options.pfxFilePassword,
        },
      }
    : {};
};

export const buildRestAPIClient = (options: RestAPIClientOptions) => {
  return new KintoneRestAPIClient({
    baseUrl: options.baseUrl,
    auth: buildAuthParam(options),
    ...buildBasicAuthParam(options),
    ...buildClientCertAuth(options),
    ...(options.guestSpaceId ? { guestSpaceId: options.guestSpaceId } : {}),
  });
};
