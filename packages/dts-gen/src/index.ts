import { FormsClientImpl } from "./kintone/clients/forms-client-impl";
import { DemoClient } from "./kintone/clients/demo-client";
import { FieldTypeConverter } from "./converters/fileldtype-converter";
import { TypeDefinitionTemplate } from "./templates/template";
import { objectValues } from "./utils//objectvalues";
import { parse } from "./cli-parser";

const args = parse(process.argv);

const client = args.demo
    ? new DemoClient()
    : new FormsClientImpl(args);

const fetchFormPropertiesInput = {
    appId: args.appId,
    guestSpaceId: args.guestSpaceId,
    preview: args.preview,
};

client
    .fetchFormProperties(fetchFormPropertiesInput)
    .then((properties) =>
        FieldTypeConverter.convertFieldTypesToFieldTypeGroups(
            objectValues(properties)
        )
    )
    .then((fieldTypeGroups) => {
        const typeName = args.typeName;
        const namespace = args.namespace;
        const input = {
            typeName,
            namespace,
            fieldTypeGroups,
        };
        TypeDefinitionTemplate.renderAsFile(
            args.output,
            input
        );
    })
    // eslint-disable-next-line no-console
    .catch((err) => console.error(err));
