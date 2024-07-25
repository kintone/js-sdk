type Plugin = {
  id: string;
  name: string;
  isMarketPlugin: boolean;
  revision: string;
};

type RequiredPlugin = Omit<Plugin, "revision">;

export type GetPluginsForRequest = {
  offset?: number;
  limit?: number;
};

export type GetPluginsForResponse = {
  plugins: Plugin[];
};

export type GetRequiredPluginsForRequest = {
  offset?: number;
  limit?: number;
};

export type GetRequiredPluginsForResponse = {
  plugins: RequiredPlugin[];
};
