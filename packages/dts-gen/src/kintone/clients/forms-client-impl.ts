import {
  FormsClient,
  FetchFormPropertiesInput,
  FieldNameAndFieldOrSubTableField,
} from "./forms-client";

import { AxiosUtils, NewInstanceInput } from "./axios-utils";
import { AxiosInstance, AxiosRequestConfig } from "axios";

export class FormsClientImpl implements FormsClient {
  readonly client: AxiosInstance;

  constructor(input: NewInstanceInput) {
    this.client = AxiosUtils.newAxiosInstance(input);
  }

  fetchFormProperties(
    input: FetchFormPropertiesInput
  ): Promise<FieldNameAndFieldOrSubTableField> {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: constructUrl(input),
      params: {
        app: input.appId,
      },
    };

    return this.client
      .request(config)
      .then(
        (resp) => resp.data.properties
      ) as Promise<FieldNameAndFieldOrSubTableField>;
  }
}

const constructUrl = (input: FetchFormPropertiesInput): string => {
  const guest = input.guestSpaceId;
  if (guest !== null && input.preview) {
    return `/k/guest/${guest}/v1/preview/app/form/fields.json`;
  } else if (input.guestSpaceId !== null) {
    return `/k/guest/${guest}/v1/app/form/fields.json`;
  } else if (input.preview) {
    return "/k/v1/preview/app/form/fields.json";
  }
  return "/k/v1/app/form/fields.json";
};

export const VisibleForTesting = {
  constructUrl,
};
