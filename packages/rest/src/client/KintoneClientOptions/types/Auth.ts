export type ApiTokenAuth = {
  apiToken: string | string[];
};

export type PasswordAuth = {
  username: string;
  password: string;
};

export type SessionAuth = {};

export type OAuthTokenAuth = {
  oAuthToken: string;
};

export type AuthOption = ApiTokenAuth | PasswordAuth | SessionAuth | OAuthTokenAuth;

export type BasicAuthOption = {
  username: string;
  password: string;
};

export type AuthOptionType = "apiToken" | "password" | "session" | "oAuthToken";

