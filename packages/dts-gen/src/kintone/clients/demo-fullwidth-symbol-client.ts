import {
    FetchFormPropertiesInput,
    FormsClient,
    FieldNameAndFieldOrSubTableField,
} from "./forms-client";
import { DemoDatas } from "./demo-fullwidth-symbols-datas";

export class DemoFullWidthSymbolClient
    implements FormsClient {
    fetchFormProperties(
        _: FetchFormPropertiesInput
    ): Promise<FieldNameAndFieldOrSubTableField> {
        const demoResp = {
            properties:
                DemoDatas.DemoDataIncludingBuiltinFields,
        };
        return Promise.resolve(
            demoResp.properties as FieldNameAndFieldOrSubTableField
        );
    }
}
