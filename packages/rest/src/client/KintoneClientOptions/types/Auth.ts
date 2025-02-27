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
  type: "oauth";
  oAuthToken: string;
};

export type AuthOption =
  | ApiTokenAuth
  | PasswordAuth
  | SessionAuth
  | OAuthTokenAuth;

export type BasicAuthOption = {
  username: string;
  password: string;
};
