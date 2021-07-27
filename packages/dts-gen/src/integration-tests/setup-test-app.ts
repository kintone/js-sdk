import * as program from "commander";
import * as fs from "fs";

import { SetUpTestAppClient } from "../kintone/clients/setup-test-app-client";
import { SetupTestApp } from "./setup-test-utils";
import { log } from "../utils/logger";

program
  .version("0.0.1")
  .option("--host <host>")
  .option("-u, --username <username>")
  .option("-p, --password <password>")
  .option("--proxy-host [proxyHost]", "proxy host", null)
  .option("--proxy-port [proxyPort]", "proxy port", null)
  .option("--proxy [proxy]", "proxy server", null)
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

const handleSetupApp = async (command) => {
  const newClientInput = {
    baseUrl: command.host,
    username: command.username,
    password: command.password,
    apiToken: command.apiToken,
    oAuthToken: command.oAuthToken,
    proxyHost: command.proxyHost,
    proxyPort: command.proxyPort,
    proxy: command.proxy,
    basicAuthUsername: command.basicAuthUsername,
    basicAuthPassword: command.basicAuthPassword,
  };

  const client = new SetUpTestAppClient(newClientInput);
  const app = await SetupTestApp.createKintoneApp(
    client,
    "dts-gen-integration-test"
  );
  await SetupTestApp.addDemoField(client, app);

  const data = fs.createReadStream(command.integrationTestJsFile);
  const fileKey = await SetupTestApp.uploadFile(client, data, {
    name: "dts-gen-integration-test.js",
    contentType: "text/javascript",
  });
  await SetupTestApp.updateJsCustomize(client, app, fileKey);
  await SetupTestApp.deployApp(client, app);
  log("Adding Demo Record");
  await SetupTestApp.addDemoRecord(client, app, command.integrationTestJsFile);
};
