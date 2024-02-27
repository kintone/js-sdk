import type { HttpClient } from "../http";
import { AbstractClient } from "./AbstractClient";

export type EndpointName =
  | "record"
  | "records"
  | "record/status"
  | "records/status"
  | "record/assignees";

export class BulkRequestClient extends AbstractClient {
  public readonly REQUESTS_LENGTH_LIMIT: number;

  constructor(client: HttpClient, guestSpaceId?: number | string) {
    super(client, guestSpaceId);
    this.REQUESTS_LENGTH_LIMIT = 20;
  }

  public send(params: {
    requests: Array<
      | {
          method: string;
          api: string;
          payload: object;
        }
      | {
          method: string;
          endpointName: EndpointName;
          payload: object;
        }
    >;
  }): Promise<{ results: Array<{ [K: string]: any }> }> {
    const { requests: requestsParam } = params;

    const requests = requestsParam.map((request) => {
      if ("endpointName" in request) {
        const { endpointName, ...rest } = request;
        return {
          api: this.buildPathWithGuestSpaceId({ endpointName }),
          ...rest,
        };
      }
      return request;
    });

    const path = this.buildPathWithGuestSpaceId({
      endpointName: "bulkRequest",
    });
    return this.client.post(path, { requests });
  }
}
