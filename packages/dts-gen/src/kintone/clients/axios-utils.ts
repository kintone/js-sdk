import axios, {
    AxiosInstance,
    AxiosProxyConfig,
    AxiosRequestConfig,
} from "axios";
import { IncomingHttpHeaders } from "http";

export interface NewInstanceInput {
    baseUrl: string;
    username: string;
    password: string;
    proxyHost: string | null;
    proxyPort: string | null;
    basicAuthPassword: string | null;
    basicAuthUsername: string | null;
}

function newAxiosInstance(
    input: NewInstanceInput
): AxiosInstance {
    let proxy: AxiosProxyConfig | false = false;
    if (
        input.proxyHost !== null &&
        input.proxyPort !== null
    ) {
        proxy = {
            host: input.proxyHost,
            port: parseInt(input.proxyPort, 10),
        };
    }

    const headers: IncomingHttpHeaders = {
        "X-Cybozu-Authorization": Buffer.from(
            `${input.username}:${input.password}`
        ).toString("base64"),
    };
    if (
        input.basicAuthPassword &&
        input.basicAuthPassword
    ) {
        headers.Authorization =
            "Basic " +
            Buffer.from(
                `${input.basicAuthUsername}:${input.basicAuthPassword}`
            ).toString("base64");
    }
    return VisibleForTesting.newAxiosInstanceInternal({
        baseURL: input.baseUrl,
        headers,
        proxy,
    });
}

function newAxiosInstanceInternal(
    config: AxiosRequestConfig
) {
    return axios.create(config);
}

export const AxiosUtils = {
    newAxiosInstance,
};

export const VisibleForTesting = {
    newAxiosInstanceInternal,
};
