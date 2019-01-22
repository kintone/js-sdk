import * as program from "commander";
import * as fs from "fs";

import { IntegrationTestPrepareClient } from "../kintone/clients/integration-test-prepare-client";
import { SetupTestApp } from "./setup-test-app-utils";

program
    .version("0.0.1")
    .option("--host <host>")
    .option("-u, --username <username>")
    .option("-p, --password <password>")
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
    .option(
        "--integration-test-js-file <integrationTestJsFile>",
        "path to integration js file which will be uploaded to test kintone app"
    )
    .parse(process.argv);

(async () => {
    await handleSetupApp(program);
})();

async function handleSetupApp(command) {
    const newClientInput = {
        host: command.host,
        username: command.username,
        password: command.password,
        proxyHost: command.proxyHost,
        proxyPort: command.proxyPort,
        basicAuthUsername: command.basicAuthUsername,
        basicAuthPassword: command.basicAuthPassword,
    };

    const client = new IntegrationTestPrepareClient(
        newClientInput
    );
    const app = await SetupTestApp.createKintoneApp(
        client,
        "kintone-typlify-integration-test"
    );
    await SetupTestApp.addDemoField(client, app);

    const data = fs.createReadStream(
        command.integrationTestJsFile
    );
    const fileKey = await SetupTestApp.uploadFile(
        client,
        data,
        "kintone-typlify-integration-test.js"
    );
    await SetupTestApp.updateJsCustomize(
        client,
        app,
        fileKey
    );
    await SetupTestApp.deployApp(client, app);
}
