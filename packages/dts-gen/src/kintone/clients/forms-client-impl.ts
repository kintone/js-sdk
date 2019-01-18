import axios, {
    AxiosInstance,
    AxiosProxyConfig,
    AxiosRequestConfig,
} from "axios";
import { Promise } from "es6-promise";

import {
    FormsClient,
    FetchFormPropertiesInput,
    FieldType,
    SubTableFieldType,
} from "./forms-client";

interface NewInstanceInput {
    host: string;
    username: string;
    password: string;
    proxyHost?: string | null;
    proxyPort?: string | null;
    basicAuthPassword?: string | null;
    basicAuthUsername?: string | null;
}

export class FormsClientImpl implements FormsClient {
    readonly client: AxiosInstance;

    constructor(input: NewInstanceInput) {
        let proxy: AxiosProxyConfig | false = false;
        if (
            input.proxyHost !== null &&
            input.proxyPort !== null
        ) {
            proxy = {
                host: input.proxyHost,
                port: parseInt(input.proxyPort),
            };
        }

        const headers = {
            "X-Cybozu-Authorization": Buffer.from(
                `${input.username}:${input.password}`
            ).toString("base64"),
        };
        if (
            input.basicAuthPassword &&
            input.basicAuthPassword
        ) {
            headers["Authorization"] =
                "Basic " +
                Buffer.from(
                    `${input.basicAuthUsername}:${
                        input.basicAuthPassword
                    }`
                ).toString("base64");
        }
        this.client = VisibleForTesting.newAxiosInstance({
            baseURL: input.host,
            headers,
            proxy,
        });
    }

    fetchFormProperties(
        input: FetchFormPropertiesInput
    ): Promise<{
        [key: string]: FieldType | SubTableFieldType;
    }> {
        const config: AxiosRequestConfig = {
            method: "GET",
            url: constructUrl(input),
            data: {
                app: input.appId,
            },
        };

        return this.client
            .request(config)
            .then(resp => resp.data.properties) as Promise<{
            [key: string]: FieldType | SubTableFieldType;
        }>;
    }
}

function constructUrl(
    input: FetchFormPropertiesInput
): string {
    const guest = input.guestSpaceId;
    if (guest !== null && input.preview) {
        return `/k/guest/${guest}/v1/preview/form.json`;
    } else if (input.guestSpaceId !== null) {
        return `/k/guest/${guest}/v1/form.json`;
    } else if (input.preview) {
        return "/k/v1/preview/form.json";
    } else {
        return "/k/v1/form.json";
    }
}

function newAxiosInstance(
    config: AxiosRequestConfig
): AxiosInstance {
    return axios.create(config);
}

export const VisibleForTesting = {
    constructUrl,
    newAxiosInstance,
};
