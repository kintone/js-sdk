import {
  FetchFormPropertiesInput,
  FormsClient,
  FieldNameAndFieldOrSubTableField,
} from "./forms-client";
import { DemoDatas } from "./demo-datas";

export class DemoClient implements FormsClient {
  fetchFormProperties(
    _: FetchFormPropertiesInput
  ): Promise<FieldNameAndFieldOrSubTableField> {
    const demoResp = {
      properties: DemoDatas.DemoDataIncludingBuiltinFields,
    };
    return Promise.resolve(
      demoResp.properties as FieldNameAndFieldOrSubTableField
    );
  }
}
