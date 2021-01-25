import { KintoneRestAPIClient } from "@kintone/rest-api-client";

const buildBasicAuthParam = (argv: any) => {
  return argv.basicAuthUsername
    ? {
        basicAuth: {
          username: argv.basicAuthUsername,
          password: argv.basicAuthPassword,
        },
      }
    : {};
};

const buildClientCertAuth = (argv: any) => {
  return argv.pfxFilePath && argv.pfxFilePassword
    ? {
        clientCertAuth: {
          pfxFilePath: argv.pfxFilePath,
          password: argv.pfxFilePassword,
        },
      }
    : {};
};

export const buildRestAPIClient = (argv: any) => {
  return new KintoneRestAPIClient({
    baseUrl: argv.baseUrl,
    auth: {
      username: argv.username,
      password: argv.password,
    },
    ...buildBasicAuthParam(argv),
    ...buildClientCertAuth(argv),
    ...(argv.guestSpaceId ? { guestSpaceId: argv.guestSpaceId } : {}),
  });
};
