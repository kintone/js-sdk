import type { HttpClient } from "../http";
import { buildPath } from "../url";
import FormData from "form-data";
import { platformDeps } from "../platform";
import { UnsupportedPlatformError } from "../platform/UnsupportedPlatformError";
import { BaseClient } from "./BaseClient";

export class FileClient extends BaseClient {
  public async uploadFile(params: {
    file: { name: string; data: unknown } | { path: string };
  }): Promise<{ fileKey: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "file",
    });

    const formData = new FormData();
    if ("path" in params.file) {
      try {
        const { name, data } = await platformDeps.readFileFromPath(
          params.file.path,
        );
        formData.append("file", data, name);
      } catch (e) {
        if (e instanceof UnsupportedPlatformError) {
          throw new Error(
            `uploadFile doesn't allow to accept a file path in ${e.platform} environment.`,
          );
        }

        throw e;
      }
    } else {
      const { name, data } = params.file;
      const fileData = platformDeps.buildFormDataValue(data, name);
      formData.append("file", fileData, name);
    }
    return this.client.postData(path, formData);
  }

  public downloadFile(params: { fileKey: string }): Promise<ArrayBuffer> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "file",
    });
    return this.client.getData(path, params);
  }
}
