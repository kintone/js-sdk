import * as program from "commander";
import * as fs from "fs";
import { Promise } from "es6-promise";

import { IntegrationTestPrepareClient } from "../kintone/clients/integration-test-prepare-client";
import { DemoDatas } from "../kintone/clients/demo-datas";

program
    .version("0.0.1")
    .option("--host [host]")
    .option("-u, --username [username]")
    .option("-p, --password [password]")
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
        "--interation-test-js-file [integrationTestJsFile]",
        "path to integration js file which will be uploaded to test kintone app"
    )
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

const client = new IntegrationTestPrepareClient(
    newClientInput
);
const input = {
    name: "kintone-typlify-integration-test",
};
const newAppPromise = client.requestCreateNewApp(input);
const addFieldsPromise = newAppPromise.then(resp => {
    const app = resp.app;
    const properties = DemoDatas.DemoDataFields;
    return client.requestAddFormField({ app, properties });
});

const fileUploadPromise = new Promise(
    (resolve: (resolved: string) => void, reject) => {
        fs.readFile(
            program.integrationTestJsFile,
            (err, data) => {
                if (err) {
                    reject(err);
                }
                client
                    .requestUploadFile({
                        data: data.toString(),
                    })
                    .then(resp => {
                        resolve(resp.fileKey);
                    });
            }
        );
    }
);

const jsCustomizePromise = Promise.all([
    newAppPromise,
    fileUploadPromise,
])
    .then(([newAppResp, fileKey]) => {
        const app = newAppResp.app;
        const scope = "ALL";
        const desktop = {
            js: [
                {
                    type: "FILE",
                    file: {
                        fileKey,
                    },
                },
            ],
        };
        return client.requestJsCustomizeUpdate({
            app,
            scope,
            desktop,
        });
    })
    .then(() => {});

const deployPromise = Promise.all([
    newAppPromise,
    addFieldsPromise,
    jsCustomizePromise,
]).then(([newAppResp, _1, _2]) => {
    const apps = [{ app: newAppResp.app }];
    return client.requestDepoy({ apps });
});

Promise.all([newAppPromise, deployPromise]).then(
    ([newAppResp, _1]) => {
        let noRetry = false;
        for (let i = 0; i < 10 && noRetry; i++) {
            client
                .requestGetDeployStatus({
                    apps: [newAppResp.app],
                })
                .catch(err => {
                    throw err;
                })
                .finally(resp => {
                    const deployStatusList = resp.apps.filter(
                        ({ app, status }) =>
                            app === newAppResp.app &&
                            status === "SUCCESS"
                    );
                    noRetry = deployStatusList.length === 1;
                    if (!noRetry) {
                        return new Promise(resolve => {
                            setTimeout(resolve, 1000);
                        });
                    }
                })
                .finally(() => {});
        }
        throw new Error();
    }
);
