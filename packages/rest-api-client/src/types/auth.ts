type ApiTokenAuth = {
  type: "apiToken";
  apiToken: string | string[];
};

type PasswordAuth = {
  type: "password";
  username: string;
  password: string;
};

type SessionAuth = {
  type: "session";
};

type OAuthTokenAuth = {
  type: "oAuthToken";
  oAuthToken: string;
};

export type DiscriminatedAuth =
  | ApiTokenAuth
  | PasswordAuth
  | SessionAuth
  | OAuthTokenAuth;

export type BasicAuth = {
  username: string;
  password: string;
};
