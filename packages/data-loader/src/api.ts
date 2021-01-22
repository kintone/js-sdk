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

export const buildRestAPIClient = (argv: any) => {
  return new KintoneRestAPIClient({
    baseUrl: argv.baseUrl,
    auth: {
      username: argv.username,
      password: argv.password,
    },
    ...buildBasicAuthParam(argv),
    ...(argv.guestSpaceId ? { guestSpaceId: argv.guestSpaceId } : {}),
  });
};
