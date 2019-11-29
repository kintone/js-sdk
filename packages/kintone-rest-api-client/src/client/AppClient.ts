import { AppID, Revision } from "../KintoneTypes";
import { HttpClient } from "../http";

type Lang = "ja" | "en" | "zh" | "user" | "default";

type Properties = {
  [fieldCode: string]: any;
};

type Layout = object[];

type DeployStatus = "PROCESSING" | "SUCCESS" | "FAIL" | "CANCEL";

type Entity = {
  accessibility: "READ" | "WRITE" | "NONE";
  includeSubs: boolean;
  entity: {
    code: string;
    type: "USER" | "GROUP" | "ORGANIZATION" | "FIELD_ENTITY";
  };
};

type Right = {
  code: string;
  entities: Entity[];
};
export class AppClient {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  public getFormFields<T extends Properties>(params: {
    app: AppID;
    lang?: Lang;
    preview?: boolean;
  }): Promise<{ properties: T; revision: string }> {
    const { preview, ...rest } = params;
    const path = `/k/v1${preview ? "/preview" : ""}/app/form/fields.json`;
    return this.client.get(path, { ...rest });
  }

  public addFormFields(params: {
    app: AppID;
    properties: object;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = "/k/v1/preview/app/form/fields.json";
    return this.client.post(path, params);
  }

  public updateFormFields(params: {
    app: AppID;
    properties: object;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = "/k/v1/preview/app/form/fields.json";
    return this.client.put(path, params);
  }

  public deleteFormFields(params: {
    app: AppID;
    fields: string[];
    revision?: Revision;
  }) {
    const path = "/k/v1/preview/app/form/fields.json";
    return this.client.delete(path, params);
  }

  public getFormLayout<T extends Layout>(params: {
    app: AppID;
    preview?: boolean;
  }): Promise<{ layout: T; revision: string }> {
    const { preview, ...rest } = params;
    const path = `/k/v1${preview ? "/preview" : ""}/app/form/layout.json`;
    return this.client.get(path, { ...rest });
  }

  public updateFormLayout(params: {
    app: AppID;
    layout: object[];
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = "/k/v1/preview/app/form/layout.json";
    return this.client.put(path, params);
  }

  public getDeployStatus(params: {
    apps: AppID[];
  }): Promise<{ apps: Array<{ app: string; status: DeployStatus }> }> {
    const path = "/k/v1/preview/app/deploy.json";
    return this.client.get(path, params);
  }

  public deployApp(params: {
    apps: Array<{ app: AppID; revision?: Revision }>;
    revert?: boolean;
  }): Promise<{}> {
    const path = "/k/v1/preview/app/deploy.json";
    return this.client.post(path, params);
  }

  public getFieldAcl(params: {
    app: AppID;
    preview?: boolean;
  }): Promise<{ rights: Right[]; revision: string }> {
    const { preview, ...rest } = params;
    const path = `/k/v1${preview ? "/preview" : ""}/field/acl.json`;
    return this.client.get(path, { ...rest });
  }
}
