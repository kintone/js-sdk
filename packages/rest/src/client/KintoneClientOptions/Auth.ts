import type {
  ApiTokenAuth,
  AuthOption,
  AuthOptionType,
  OAuthTokenAuth,
  PasswordAuth,
  SessionAuth,
} from "./types/Auth";

import { Base64 } from "js-base64";

const getAuthType = (auth: AuthOption): AuthOptionType => {
  if ("username" in auth) {
    return "password";
  }
  if ("apiToken" in auth) {
    return "apiToken";
  }
  if ("oAuthToken" in auth) {
    return "oAuthToken";
  }
  return "session";
};

type AuthHeader =
  | {
      "X-Cybozu-Authorization": string;
    }
  | {
      "X-Cybozu-API-Token": string;
    }
  | {
      "Authorization": string;
    }
  | {
      "X-Requested-With": "XMLHttpRequest";
    }
  | {};

export const buildAuth = (_auth: AuthOption): AuthHeader => {
  if (isPasswordAuth(_auth)) {
    return {
      "X-Cybozu-Authorization": Base64.encode(
        `${_auth.username}:${_auth.password}`,
      ),
    };
  }
  if (isApiTokenAuth(_auth)) {
    const apiToken = _auth.apiToken;
    return {
      "X-Cybozu-API-Token": Array.isArray(apiToken)
        ? apiToken.join(",")
        : apiToken,
    };
  }
  if (isOAuth(_auth)) {
    return {
      Authorization: `Bearer ${_auth.oAuthToken}`,
    };
  }
  return {
    "X-Requested-With": "XMLHttpRequest",
  };
};

export const isPasswordAuth = (_auth: AuthOption): _auth is PasswordAuth => {
  return getAuthType(_auth) === "password";
};
export const isApiTokenAuth = (_auth: AuthOption): _auth is ApiTokenAuth => {
  return getAuthType(_auth) === "apiToken";
};
export const isOAuth = (_auth: AuthOption): _auth is OAuthTokenAuth => {
  return getAuthType(_auth) === "oAuthToken";
};
export const isSession = (_auth: AuthOption): _auth is SessionAuth => {
  return Object.keys(_auth).length === 0 || getAuthType(_auth) === "session";
};
