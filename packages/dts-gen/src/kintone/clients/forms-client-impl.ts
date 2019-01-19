import { Promise } from "es6-promise";

import {
    FormsClient,
    FetchFormPropertiesInput,
    FieldTypesOrSubTableFieldTypes,
} from "./forms-client";

import {
    AxiosUtils,
    NewInstanceInput,
} from "./axios-utils";
import { AxiosInstance, AxiosRequestConfig } from "axios";

export class FormsClientImpl implements FormsClient {
    readonly client: AxiosInstance;

    constructor(input: NewInstanceInput) {
        this.client = AxiosUtils.newAxiosInstance(input);
    }

    fetchFormProperties(
        input: FetchFormPropertiesInput
    ): Promise<FieldTypesOrSubTableFieldTypes> {
        const config: AxiosRequestConfig = {
            method: "GET",
            url: constructUrl(input),
            data: {
                app: input.appId,
            },
        };

        return this.client
            .request(config)
            .then(resp => resp.data.properties) as Promise<
            FieldTypesOrSubTableFieldTypes
        >;
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

export const VisibleForTesting = {
    constructUrl,
};
