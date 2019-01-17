import * as program from "commander";

import { FormsClientImpl } from "./kintone/clients/forms-client-impl";
import { DemoClient } from "./kintone/clients/demo-client";
import { FieldTypeConverter } from "./converters/fileldtype-converter";
import { TypeDefinitionTemplate } from "./templates/template";

program
    .version("0.0.1")
    .option("--host [host]")
    .option("-u, --username [username]")
    .option("-p, --password [password]")
    .option("--app-id [appId]")
    .option("--guest-space-id [guestSpaceId]")
    .option(
        "--preview",
        "set this option if kintone app is in preview mode",
        false
    )
    .option("--type-name [typeName]", "type name to be generated", "Fields")
    .option(
        "--namespace [namespace]",
        "namespace of type to be generated",
        "kintone.types"
    )
    .option("--demo", "Generate Type definition from demo data.", null, false)
    .option("--proxy-host [proxyHost]", "proxy host", null)
    .option("--proxy-port [proxyPort]", "proxy port", null)
    .option(
        "--basic-auth-username [basicAuthUsername]",
        "username for basic authentication",
        null
    )
    .option(
        "--basic-auth-password [basicAuthPassword]",
        "password for basic authentication",
        null
    )
    .option("-o, --output [output]", "output file name", "fields.d.ts")
    .parse(process.argv);

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
    : FormsClientImpl.newClient(newClientInput);
const fetchFormPropertiesInput = {
    appId: program.appId,
    guestSpaceId: program.guestSpaceId,
    preview: program.preview,
};

client
    .fetchFormProperties(fetchFormPropertiesInput)
    .then(FieldTypeConverter.convertFieldTypesToFieldTypeGroups)
    .then(fields => {
        const typeName = program.typeName;
        const namespace = program.namespace;
        const input = {
            typeName,
            namespace,
            fields,
        };
        TypeDefinitionTemplate.renderAsFile(program.output, input);
    })
    // eslint-disable-next-line no-console
    .catch(err => console.error(err));
