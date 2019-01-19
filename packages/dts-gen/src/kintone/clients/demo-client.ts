import { Promise } from "es6-promise";

import {
    FetchFormPropertiesInput,
    FormsClient,
    FieldTypesOrSubTableFieldTypes,
} from "./forms-client";
import { DemoDatas } from "./demo-datas";

export class DemoClient implements FormsClient {
    fetchFormProperties(
        _: FetchFormPropertiesInput
    ): Promise<FieldTypesOrSubTableFieldTypes> {
        const demoResp = {
            properties:
                DemoDatas.DemoDataIncludingBuiltinFields,
        };
        return Promise.resolve(
            demoResp.properties as FieldTypesOrSubTableFieldTypes
        );
    }
}
