import { BaseClient } from "./BaseClient";
import type {
  GetPluginsForRequest,
  GetPluginsForResponse,
} from "./types/plugin";

export class PluginClient extends BaseClient {
  public getPlugins(
    params: GetPluginsForRequest,
  ): Promise<GetPluginsForResponse> {
    const path = this.buildPath({ endpointName: "plugins" });
    return this.client.get(path, params);
  }
}
