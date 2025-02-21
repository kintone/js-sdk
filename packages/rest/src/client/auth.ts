import type {
  DiscriminatedAuth,
} from "../types/auth";

import { UnsupportedPlatformError } from "../platform/UnsupportedPlatformError";
import { Base64 } from "js-base64";
import { platformDeps } from "../platform";

type OmitTypePropertyFromUnion<T> = T extends unknown ? Omit<T, "type"> : never;
type Auth = OmitTypePropertyFromUnion<DiscriminatedAuth>;

const buildDiscriminatedAuth = (auth: Auth): DiscriminatedAuth => {
  if ("username" in auth) {
    return { type: "password", ...auth };
  }
  if ("apiToken" in auth) {
    return { type: "apiToken", ...auth };
  }
  if ("oAuthToken" in auth) {
    return { type: "oAuthToken", ...auth };
  }
  try {
    return platformDeps.getDefaultAuth();
  } catch (e) {
    if (e instanceof UnsupportedPlatformError) {
      throw new Error(
        `session authentication is not supported in ${e.platform} environment.`,
      );
    }
    throw e;
  }
};

export type AuthHeader =
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
    };

export const buildAuth = (_auth: Auth): AuthHeader | {} => {
  const auth = buildDiscriminatedAuth(_auth);

  switch (auth.type) {
    case "password": {
      return {
        "X-Cybozu-Authorization": Base64.encode(
          `${auth.username}:${auth.password}`,
        ),
      };
    }
    case "apiToken": {
      const apiToken = auth.apiToken;
      return {
        "X-Cybozu-API-Token": Array.isArray(apiToken)
          ? apiToken.join(",")
          : apiToken,
      };
    }
    case "oAuthToken": {
      return {
        Authorization: `Bearer ${auth.oAuthToken}`,
      };
    }
    default:
      return {
        "X-Requested-With": "XMLHttpRequest",
      };
  }
};

export const isSession = (_auth: Auth): boolean => {
  return buildDiscriminatedAuth(_auth).type == "session":
}

