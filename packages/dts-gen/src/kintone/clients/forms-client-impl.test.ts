import {
    FormsClientImpl,
    VisibleForTesting,
} from "./forms-client-impl";
import { AxiosUtils } from "./axios-utils";

describe("VisibleForTesting.constructUrl", () => {
    const testCases = [
        {
            preview: false,
            guestSpaceId: "1",
            expected: "/k/guest/1/v1/app/form/fields.json",
        },
        {
            preview: false,
            guestSpaceId: null,
            expected: "/k/v1/app/form/fields.json",
        },
        {
            preview: true,
            guestSpaceId: "1",
            expected:
                "/k/guest/1/v1/preview/app/form/fields.json",
        },
        {
            preview: true,
            guestSpaceId: null,
            expected: "/k/v1/preview/app/form/fields.json",
        },
    ];
    test.each(testCases)(
        "constructUrl with %p",
        ({ preview, guestSpaceId, expected }) => {
            const input = {
                appId: "123",
                preview,
                guestSpaceId,
            };
            expect(
                VisibleForTesting.constructUrl(input)
            ).toEqual(expected);
        }
    );
});

describe("FormsClientImpl#fetchFormProperties", () => {
    test("#fertchFormProperties calls AxoisInstance#request", () => {
        const mockConstructUrl = jest.fn();
        mockConstructUrl.mockReturnValue(
            "/k/v1/app/form/fields.json"
        );
        VisibleForTesting.constructUrl = mockConstructUrl;

        const mockRequest = jest.fn();
        mockRequest.mockReturnValue(
            Promise.resolve({
                data: {
                    properties: {},
                },
            })
        );

        const mockNewAxiosInstance = jest.fn();
        mockNewAxiosInstance.mockReturnValue({
            request: mockRequest,
        });
        AxiosUtils.newAxiosInstance = mockNewAxiosInstance;

        const input = {
            baseUrl: "https://kintone.com",
            username: "username",
            password: "password",
            proxyHost: null,
            proxyPort: null,
            basicAuthPassword: null,
            basicAuthUsername: null,
        };
        const fetchInput = {
            appId: "1",
            preview: false,
            guestSpaceId: null,
        };
        new FormsClientImpl(input).fetchFormProperties(
            fetchInput
        );

        const expectedRequestConfig = {
            method: "GET",
            url: "/k/v1/app/form/fields.json",
            params: {
                app: "1",
            },
        };
        expect(mockRequest).toBeCalledWith(
            expectedRequestConfig
        );
    });
});
