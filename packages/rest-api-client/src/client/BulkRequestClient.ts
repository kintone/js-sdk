import { HttpClient } from "../http";

export class BulkRequestClient {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  public send(params: {
    requests: Array<{
      method: string;
      api: string;
      payload: object;
    }>;
  }): Promise<object[]> {
    const path = "/k/v1/bulkRequest.json";
    return this.client.post(path, params);
  }
}
