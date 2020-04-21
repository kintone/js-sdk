import { FormsClientImpl } from "./kintone/clients/forms-client-impl";
import { DemoClient } from "./kintone/clients/demo-client";
import { FieldTypeConverter } from "./converters/fileldtype-converter";
import { TypeDefinitionTemplate } from "./templates/template";
import { objectValues } from "./utils//objectvalues";
import { createCommanderProgram } from "./createCommanderProgram";

const program = createCommanderProgram();
program.parse(process.argv);

const newClientInput = {
    host: program.host,
    username: program.username,
    password: program.password,
    proxyHost: program.proxyHost,
    proxyPort: program.proxyPort,
    basicAuthUsername: program.basicAuthUsername,
    basicAuthPassword: program.basicAuthPassword,
};

const client = program.demo
    ? new DemoClient()
    : new FormsClientImpl(newClientInput);

const fetchFormPropertiesInput = {
    appId: program.appId,
    guestSpaceId: program.guestSpaceId,
    preview: program.preview,
};

client
    .fetchFormProperties(fetchFormPropertiesInput)
    .then(properties =>
        FieldTypeConverter.convertFieldTypesToFieldTypeGroups(
            objectValues(properties)
        )
    )
    .then(fieldTypeGroups => {
        const typeName = program.typeName;
        const namespace = program.namespace;
        const input = {
            typeName,
            namespace,
            fieldTypeGroups,
        };
        TypeDefinitionTemplate.renderAsFile(
            program.output,
            input
        );
    })
    // eslint-disable-next-line no-console
    .catch(err => console.error(err));
