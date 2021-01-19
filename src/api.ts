import { KintoneRestAPIClient } from "@kintone/rest-api-client";

export const buildRestAPIClient = (argv: any) => {
  return new KintoneRestAPIClient({
    baseUrl: argv.baseUrl,
    auth: {
      username: argv.username,
      password: argv.password,
    },
    guestSpaceId: argv.guestSpaceId,
  });
};
