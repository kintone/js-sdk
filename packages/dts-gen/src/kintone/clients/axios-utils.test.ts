import {
    AxiosUtils,
    VisibleForTesting,
} from "./axios-utils";
import { AxiosRequestConfig } from "axios";

describe("FormsClientImpl#constructor", () => {
    const baseUrl = "https://kintone.com";
    const authToken = Buffer.from(
        "username:password"
    ).toString("base64");

    function assertConstructorWithArgs(
        input,
        expectedInput: AxiosRequestConfig
    ) {
        VisibleForTesting.newAxiosInstanceInternal = jest.fn();
        AxiosUtils.newAxiosInstance(input);
        expect(
            VisibleForTesting.newAxiosInstanceInternal
        ).toBeCalledWith(expectedInput);
    }

    test("with plain settings", () => {
        const input = {
            baseUrl,
            username: "username",
            password: "password",
            proxyHost: null,
            proxyPort: null,
            basicAuthPassword: null,
            basicAuthUsername: null,
        };

        const headers = {
            "X-Cybozu-Authorization": authToken,
        };
        const expectedCalledWith = {
            headers,
            baseURL: baseUrl,
            proxy: undefined,
        } as AxiosRequestConfig;
        assertConstructorWithArgs(
            input,
            expectedCalledWith
        );
    });

    test("with proxy", () => {
        const input = {
            baseUrl,
            username: "username",
            password: "password",
            proxyHost: "proxyHost",
            proxyPort: "1234",
            basicAuthPassword: null,
            basicAuthUsername: null,
        };

        const headers = {
            "X-Cybozu-Authorization": authToken,
        };
        const expectedCalledWith = {
            headers,
            baseURL: baseUrl,
            proxy: {
                host: "proxyHost",
                port: 1234,
            },
        };
        assertConstructorWithArgs(
            input,
            expectedCalledWith
        );
    });

    test("with basic auth", () => {
        const input = {
            baseUrl,
            username: "username",
            password: "password",
            proxyHost: null,
            proxyPort: null,
            basicAuthPassword: "basicUsername",
            basicAuthUsername: "basicPassword",
        };

        const headers = {
            "X-Cybozu-Authorization": authToken,
            Authorization:
                "Basic YmFzaWNQYXNzd29yZDpiYXNpY1VzZXJuYW1l",
        };
        const expectedCalledWith = {
            headers,
            baseURL: baseUrl,
            proxy: undefined,
        } as AxiosRequestConfig;
        assertConstructorWithArgs(
            input,
            expectedCalledWith
        );
    });
});
