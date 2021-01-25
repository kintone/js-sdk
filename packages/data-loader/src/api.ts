import { KintoneRestAPIClient } from "@kintone/rest-api-client";

const buildAuthParam = (argv: any) => {
  const passwordAuthParam = {
    username: argv.username,
    password: argv.password,
  };

  if (argv.username) return passwordAuthParam;
  if (argv.apiToken) return { apiToken: argv.apiToken };
  return passwordAuthParam;
};

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
    auth: buildAuthParam(argv),
    ...buildBasicAuthParam(argv),
    ...buildClientCertAuth(argv),
    ...(argv.guestSpaceId ? { guestSpaceId: argv.guestSpaceId } : {}),
  });
};
