type Plugin = {
  id: string;
  name: string;
  isMarketPlugin: boolean;
  revision: string;
};

export type GetPluginsForRequest = {
  offset?: number;
  limit?: number;
};

export type GetPluginsForResponse = {
  plugins: Plugin[];
};
