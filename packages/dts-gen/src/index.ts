import { FormsClientImpl } from "./kintone/clients/forms-client-impl";
import { DemoClient } from "./kintone/clients/demo-client";
import { FieldTypeConverter } from "./converters/fileldtype-converter";
import { TypeDefinitionTemplate } from "./templates/template";
import { objectValues } from "./utils//objectvalues";
import { createCommanderProgram } from "./createCommanderProgram";

const program = createCommanderProgram();
program.parse(process.argv);

const {
    // HTTP_PROXY,
    // HTTPS_PROXY,
    KINTONE_DOMAIN,
    KINTONE_USERNAME,
    KINTONE_PASSWORD,
    KINTONE_BASIC_AUTH_USERNAME,
    KINTONE_BASIC_AUTH_PASSWORD,
} = process.env;

const newClientInput = {
    host: program.host || `https://${KINTONE_DOMAIN}`,
    username: program.username || KINTONE_USERNAME,
    password: program.password || KINTONE_PASSWORD,
    proxyHost: program.proxyHost,
    proxyPort: program.proxyPort,
    basicAuthUsername:
        program.basicAuthUsername ||
        KINTONE_BASIC_AUTH_USERNAME,
    basicAuthPassword:
        program.basicAuthPassword ||
        KINTONE_BASIC_AUTH_PASSWORD,
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
    .then((properties) =>
        FieldTypeConverter.convertFieldTypesToFieldTypeGroups(
            objectValues(properties)
        )
    )
    .then((fieldTypeGroups) => {
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
    .catch((err) => console.error(err));
