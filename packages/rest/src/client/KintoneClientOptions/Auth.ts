import type { AuthOption, SessionAuth } from "./types/Auth.js";

import { Base64 } from "js-base64";

type AuthHeader =
  | {
      "X-Cybozu-Authorization": string;
    }
  | {
      "X-Cybozu-API-Token": string;
    }
  | {
      Authorization: string;
    }
  | {
      "X-Requested-With": "XMLHttpRequest";
    }
  | {};

export const buildAuth = (_auth: AuthOption): AuthHeader => {
  switch (_auth.type) {
    case "password": {
      return {
        "X-Cybozu-Authorization": Base64.encode(
          `${_auth.username}:${_auth.password}`,
        ),
      };
    }
    case "apiToken": {
      const apiToken = _auth.apiToken;
      return {
        "X-Cybozu-API-Token": Array.isArray(apiToken)
          ? apiToken.join(",")
          : apiToken,
      };
    }
    case "oauth": {
      return {
        Authorization: `Bearer ${_auth.oAuthToken}`,
      };
    }
    case "session":
    default:
      return {
        "X-Requested-With": "XMLHttpRequest",
      };
  }
};

export const isSessionAuth = (
  _auth: AuthOption | undefined,
): _auth is SessionAuth => {
  return (
    _auth === undefined ||
    Object.keys(_auth).length === 0 ||
    _auth.type === "session"
  );
};
