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
