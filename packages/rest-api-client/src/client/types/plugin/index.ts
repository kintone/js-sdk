import type { PluginID } from "..";

type Plugin = {
  id: string;
  name: string;
  isMarketPlugin: boolean;
  version: string;
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

export type GetAppsForRequest = {
  id: PluginID;
  offset?: number;
  limit?: number;
};

export type GetAppsForResponse = {
  apps: Array<{ id: string; name: string }>;
};

export type UpdatePluginForRequest = {
  id: PluginID;
  fileKey: string;
};

export type UpdatePluginForResponse = {
  id: PluginID;
  version: string;
};

export type InstallPluginForRequest = {
  fileKey: string;
};

export type InstallPluginForResponse = {
  id: PluginID;
  version: string;
};
