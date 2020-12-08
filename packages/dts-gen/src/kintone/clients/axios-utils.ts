import axios, {
    AxiosInstance,
    AxiosProxyConfig,
    AxiosRequestConfig,
} from "axios";
import { IncomingHttpHeaders } from "http";

export interface NewInstanceInput {
    baseUrl: string;
    username: string | null;
    password: string | null;
    oAuthToken: string;
    apiToken: string;
    proxyHost: string | null;
    proxyPort: string | null;
    basicAuthPassword: string | null;
    basicAuthUsername: string | null;
}

function newAxiosInstance(
    input: NewInstanceInput
): AxiosInstance {
    let proxy: AxiosProxyConfig | undefined;
    if (
        input.proxyHost !== null &&
        input.proxyPort !== null
    ) {
        proxy = {
            host: input.proxyHost,
            port: parseInt(input.proxyPort, 10),
        };
    }

    let headers: IncomingHttpHeaders;
    if (input.username && input.password) {
        headers = {
            "X-Cybozu-Authorization": Buffer.from(
                `${input.username}:${input.password}`
            ).toString("base64"),
        };
    } else if (input.apiToken) {
        headers = {
            "X-Cybozu-API-Token": input.apiToken,
        };
    } else if (input.oAuthToken) {
        headers = {
            Authorization: `Bearer ${input.oAuthToken}`,
        };
    } else {
        throw new Error(
            "cannot get an authentication input"
        );
    }

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
