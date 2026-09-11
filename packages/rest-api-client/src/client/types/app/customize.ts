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
 * A permission granted to the customization when the Secure Option is used.
 */
export type AppCustomizePermission = {
  permission: string;
};

/**
 * Secure Option settings of the JavaScript and CSS Customization.
 *
 * These properties are absent unless the app has the Secure Option turned on.
 */
export type AppCustomizeSandboxForResponse = {
  permissions?: AppCustomizePermission[];
  allowedHosts?: string[];
};

/**
 * Secure Option settings to update.
 *
 * Omitting a property leaves the current setting unchanged.
 * Passing an empty array clears the setting.
 *
 * The request fails unless the app has the Secure Option turned on.
 */
export type AppCustomizeSandboxForParameter = {
  permissions?: AppCustomizePermission[];
  allowedHosts?: string[];
};
