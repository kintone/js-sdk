import { BaseClient } from "./BaseClient";
import type {
  GetPluginsForRequest,
  GetPluginsForResponse,
  GetRequiredPluginsForRequest,
  GetRequiredPluginsForResponse,
} from "./types/plugin";

export class PluginClient extends BaseClient {
  public getPlugins(
    params: GetPluginsForRequest,
  ): Promise<GetPluginsForResponse> {
    const path = this.buildPath({ endpointName: "plugins" });
    return this.client.get(path, params);
  }

  public getRequiredPlugins(
    params: GetRequiredPluginsForRequest,
  ): Promise<GetRequiredPluginsForResponse> {
    const path = this.buildPath({ endpointName: "plugins/required" });
    return this.client.get(path, params);
  }
}
