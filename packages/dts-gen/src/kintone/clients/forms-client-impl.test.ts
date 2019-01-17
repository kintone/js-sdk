import {FormsClientImpl, VisibleForTesting} from "./forms-client-impl";
import {AxiosRequestConfig} from "axios";

describe("VisibleForTesting.constructUrl", () => {
    const testCases = [
        {
            preview: false,
            guestSpaceId: "1",
            expected: "/k/guest/1/v1/app/form/fields.json"
        },
        {
            preview: false,
            guestSpaceId: null,
            expected: "/k/v1/app/form/fields.json"
        },
        {
            preview: true,
            guestSpaceId: "1",
            expected: "/k/guest/1/v1/preview/app/form/fields.json"
        },
        {
            preview: true,
            guestSpaceId: null,
            expected: "/k/v1/preview/app/form/fields.json"
        }
    ];
    test.each(testCases)("constructUrl with %p", ({preview, guestSpaceId, expected}) => {
        const input = {
            appId: "123",
            preview,
            guestSpaceId
        };
        expect(VisibleForTesting.constructUrl(input)).toEqual(expected);
    });
});

describe("FormClientImpl", () => {
    const baseURL = "https://kintone.com";
    const authToken = Buffer.from("username:password").toString("base64");

    function assertConstructorWithArgs(input, expectedInput: AxiosRequestConfig) {
        VisibleForTesting.newAxiosInstance = jest.fn();
        new FormsClientImpl(input);
        expect(VisibleForTesting.newAxiosInstance)
            .toBeCalledWith(expectedInput);
    }

    test("constructor - plain settings", () => {
        const input = {
            host: baseURL,
            username: "username",
            password: "password",
            proxyHost: null,
            proxyPort: null,
            basicAuthPassword: null,
            basicAuthUsername: null
        };

        const headers = {
            "X-Cybozu-Authorization" : authToken
        };
        const expectedCalledWith = {
            headers,
            baseURL,
            proxy: false,
        } as AxiosRequestConfig;
        assertConstructorWithArgs(input, expectedCalledWith);
    });

    test("constructor - with proxy", () => {
        const input = {
            host: baseURL,
            username: "username",
            password: "password",
            proxyHost: "proxyHost",
            proxyPort: "1234",
            basicAuthPassword: null,
            basicAuthUsername: null
        };

        const headers = {
            "X-Cybozu-Authorization" : authToken
        };
        const expectedCalledWith = {
            headers,
            baseURL,
            proxy: {
                host: "proxyHost",
                port: 1234
            },
        };
        assertConstructorWithArgs(input, expectedCalledWith);
    });

    test("constructor - with basic auth", () => {
        const input = {
            host: baseURL,
            username: "username",
            password: "password",
            proxyHost: null,
            proxyPort: null,
            basicAuthPassword: "basicUsername",
            basicAuthUsername: "basicPassword"
        };

        const headers = {
            "X-Cybozu-Authorization" : authToken,
            "Authorization": "Basic YmFzaWNQYXNzd29yZDpiYXNpY1VzZXJuYW1l"
        };
        const expectedCalledWith = {
            headers,
            baseURL,
            proxy: false,
        } as AxiosRequestConfig;
        assertConstructorWithArgs(input, expectedCalledWith);
    });
});