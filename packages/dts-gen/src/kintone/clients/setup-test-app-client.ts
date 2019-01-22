import { AxiosInstance, AxiosRequestConfig } from "axios";
import * as FormData from "form-data";
import * as fs from "fs";

import {
    NewInstanceInput,
    AxiosUtils,
} from "./axios-utils";

interface CreateAppInput {
    name: string;
}

interface CreateAppOutput {
    app: string;
    revision: string;
}

interface AddFormFieldInput {
    app: string;
    properties: any[];
}

interface AddFormFieldOutput {}

interface DeployInput {
    apps: {
        app: string;
    }[];
}

interface DeployStatusInput {
    apps: string[];
}

interface DeployStatusOutput {
    apps: {
        app: string;
        status:
            | "PROCESSING"
            | "SUCCESS"
            | "FAIL"
            | "CANCEL";
    }[];
}

interface UploadFileInput {
    data: fs.ReadStream;
    fileName: string;
    contentType: string;
}

interface UploadFileOutput {
    fileKey: string;
}

interface JsCustomizeInput {
    app: string;
    scope: string;
    desktop: {
        js: { type: string; file: { fileKey: string } }[];
    };
}

interface JsCustomizeOutput {
    revision: string;
}

interface AddRecordInput {
    app: string;
    record: any;
}

interface AddRecordOutput {
    id: string;
    revision: string;
}
export class SetUpTestAppClient {
    readonly client: AxiosInstance;

    constructor(input: NewInstanceInput) {
        this.client = AxiosUtils.newAxiosInstance(input);
    }

    requestCreateNewApp(
        input: CreateAppInput
    ): Promise<CreateAppOutput> {
        const config: AxiosRequestConfig = {
            url: "/k/v1/preview/app.json",
            method: "POST",
            data: input,
        };
        return this.client
            .request(config)
            .then(resp => resp.data as CreateAppOutput);
    }

    requestAddFormField(
        input: AddFormFieldInput
    ): Promise<AddFormFieldOutput> {
        const config: AxiosRequestConfig = {
            url: "/k/v1/preview/app/form/fields.json",
            method: "POST",
            data: input,
        };
        return this.client.request(config).then(resp => {
            return resp.data as AddFormFieldOutput;
        });
    }

    requestUploadFile(
        input: UploadFileInput
    ): Promise<UploadFileOutput> {
        const data = new FormData();

        data.append("file", input.data, {
            filename: input.fileName,
            contentType: input.contentType,
        });
        const headers = data.getHeaders();
        const config: AxiosRequestConfig = {
            url: "/k/v1/file.json",
            headers,
            method: "POST",
            data,
        };
        return this.client.request(config).then(resp => {
            return resp.data as UploadFileOutput;
        });
    }

    requestJsCustomizeUpdate(
        input: JsCustomizeInput
    ): Promise<JsCustomizeOutput> {
        const config: AxiosRequestConfig = {
            url: "/k/v1/preview/app/customize.json",
            method: "PUT",
            data: input,
        };
        return this.client.request(config).then(resp => {
            return resp.data as JsCustomizeOutput;
        });
    }

    requestDepoy(input: DeployInput): Promise<any> {
        const config: AxiosRequestConfig = {
            url: "/k/v1/preview/app/deploy.json",
            method: "POST",
            data: input,
        };
        return this.client
            .request(config)
            .then(resp => resp.data);
    }

    requestGetDeployStatus(
        input: DeployStatusInput
    ): Promise<DeployStatusOutput> {
        const config: AxiosRequestConfig = {
            url: "/k/v1/preview/app/deploy.json",
            method: "GET",
            data: input,
        };
        return this.client.request(config).then(resp => {
            return resp.data as DeployStatusOutput;
        });
    }

    requestAddRecord(
        input: AddRecordInput
    ): Promise<AddRecordOutput> {
        const config: AxiosRequestConfig = {
            url: "/k/v1/record.json",
            method: "POST",
            data: input,
        };
        return this.client.request(config).then(resp => {
            return resp.data as AddRecordOutput;
        });
    }
}
