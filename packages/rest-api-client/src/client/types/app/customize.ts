export type AppCustomizeScope = "ALL" | "ADMIN" | "NONE";

type AppCustomizeResourceForResponse =
  | {
      type: "URL";
      url: string;
    }
  | {
      type: "FILE";
      file: {
        fileKey: string;
        name: string;
        contentType: string;
        size: string;
      };
    };

type AppCustomizeResourceForParameter =
  | {
      type: "URL";
      url: string;
    }
  | {
      type: "FILE";
      file: {
        fileKey: string;
      };
    };

export type AppCustomizeForResponse = {
  js: AppCustomizeResourceForResponse[];
  css: AppCustomizeResourceForResponse[];
};

export type AppCustomizeForParameter = {
  js?: AppCustomizeResourceForParameter[];
  css?: AppCustomizeResourceForParameter[];
};

/**
 * A permission that the customization may use.
 *
 * The available permissions are the same as the ones for plugins.
 */
export type AppCustomizePermission = {
  permission: string;
};

/**
 * The sandbox settings of the JavaScript and CSS customization.
 *
 * These properties are absent if the corresponding Update Option is disabled.
 */
export type AppCustomizeSandboxForResponse = {
  permissions?: AppCustomizePermission[];
  /**
   * Each entry specifies a scheme and does not contain a path,
   * such as `https://example.com` or `https://*.example.com`.
   */
  allowedHosts?: string[];
};

/**
 * The sandbox settings to update.
 *
 * Omitting a property leaves the current setting unchanged.
 * Passing an empty array clears the setting.
 *
 * Specifying either property fails if the corresponding Update Option is disabled.
 */
export type AppCustomizeSandboxForParameter = {
  permissions?: AppCustomizePermission[];
  /**
   * Each entry must specify a scheme and must not contain a path,
   * such as `https://example.com` or `https://*.example.com`.
   */
  allowedHosts?: string[];
};
