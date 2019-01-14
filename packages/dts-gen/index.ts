import * as program from "commander";

import {FormsClientImpl} from './kintone/clients/forms-client-impl';
import {DemoClient} from "./kintone/clients/demo-client";
import {FieldTypeConverter} from './converters/fileldtype-converter';
import {TypeDefinitionTemplate} from "./templates/template";

program
    .version('0.0.1')
    .option('--host [host]')
    .option('-u, --username [username]')
    .option('-p, --password [password]')
    .option('--app-id [appId]')   
    .option('--type-name [typeName]', 'type name to be generated', 'Fields')
    .option('--namespace [namespace]', 'namespace of type to be generated', 'kintone.types')
    .option('--demo', 'Generate Type definition from demo data.', null, false)
    .option('-o, --output [output]', 'output file name', 'appfields.d.ts')
    .parse(process.argv);

const newClientInput = {
    host: program.host,
    username: program.username,
    password: program.password
};
const client = program.demo ? new DemoClient() : FormsClientImpl.newClient(newClientInput);

client.fetchFormProperties({appId: program.appId})
    .then(FieldTypeConverter.convertFieldTypesToFieldTypeGroups)
    .then(fields => {
        const typeName = program.typeName;
        const namespace = program.namespace;
        const input = {
            typeName,
            namespace,
            fields
        };
        TypeDefinitionTemplate.renderAsFile(program.output, input)
    }).catch(err => console.error(err));