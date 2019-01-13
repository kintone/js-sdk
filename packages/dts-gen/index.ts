import * as program from "commander";
import * as nunjucks from "nunjucks";
import * as fs from 'fs';
import * as path from 'path';
import * as prettier from 'prettier';

import {FormsClient} from './kintone/clients/forms-client';
import {FieldTypeConverter} from './converters/fileldtype-converter';

program
    .version('0.0.1')
    .option('--host [host]')
    .option('-u, --username [username]')
    .option('-p, --password [password]')
    .option('--app-id [appId]')   
    .option('--type-name [typeName]')
    .parse(process.argv)

const newClientInput = {
    host: program.host,
    username: program.username,
    password: program.password
}
const client = FormsClient.newClient(newClientInput);

client.fetchFormProperties({appId: "123"})
    .then(FieldTypeConverter.convertFieldTypesToFieldTypeGroups)
    .then(fields => {
        fs.readFile(path.join(__dirname, '/templates/appfields.d.ts.njk'), (err, data) => {
            nunjucks.configure({ autoescape: false });
            const source = nunjucks.renderString(data.toString(), fields);
            const formatOption = { parser : "typescript" };
            console.log(prettier.format(source, formatOption));
        });
    });