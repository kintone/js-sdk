import * as program from "commander";
import * as fs from "fs";

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
        "--integration-test-js-file [integrationTestJsFile]",
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
const JsCutomizeFileName =
    "kintone-typlify-integration-test.js";

const rethrow = err => {
    if (err) {
        throw err;
    }
};

const newAppPromise = client
    .requestCreateNewApp(input)
    .then(resp => {
        console.log(`Preparing for App(ID:${resp.app})`);
        return resp.app;
    });

const addFieldsPromise = newAppPromise
    .then(app => {
        console.log(
            `Preparing for field settings(ID:${app})`
        );
        const properties = DemoDatas.DemoDataFields;
        return client
            .requestAddFormField({
                app,
                properties,
            })
            .catch(rethrow);
    })
    .catch(rethrow);

console.log(`Uploading ${JsCutomizeFileName}`);
const data = fs.createReadStream(
    `${program.integrationTestJsFile}`
);
const fileUploadPromise = client
    .requestUploadFile({
        data,
        fileName: JsCutomizeFileName,
    })
    .then(resp => {
        console.log(
            `Finish Uploading ${JsCutomizeFileName}(${
                resp.fileKey
            })`
        );
        return resp.fileKey;
    });
const jsCustomizePromise = Promise.all([
    newAppPromise,
    fileUploadPromise,
    addFieldsPromise,
]).then(([app, fileKey]) => {
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
    return client
        .requestJsCustomizeUpdate({
            app,
            scope,
            desktop,
        })
        .then(resp => {
            console.log(resp);
            return resp;
        })
        .catch(err => {
            if (err) {
                console.log(err);
            }
        });
});

const deployPromise = Promise.all([
    newAppPromise,
    addFieldsPromise,
    jsCustomizePromise,
])
    .then(([app, _1, _2]) => {
        const apps = [{ app }];
        return client.requestDepoy({ apps }).catch(err => {
            if (err) {
                console.log(err);
            }
        });
    })
    .catch(err => {
        if (err) {
            throw err;
        }
    });

async function sleep(msec) {
    return new Promise(resolve =>
        setTimeout(resolve, msec)
    );
}
Promise.all([newAppPromise, deployPromise])
    .then(async ([app, _1]) => {
        let noRetry = false;
        for (let i = 0; i < 10 && !noRetry; i++) {
            const deployStatusPromise = client
                .requestGetDeployStatus({
                    apps: [app],
                })
                .then(resp => {
                    return (
                        resp.apps.filter(
                            ({ app, status }) =>
                                app === app &&
                                status === "SUCCESS"
                        ).length === 1
                    );
                })
                .catch(err => {
                    if (err) {
                        console.log(err);
                    }
                    return false;
                });
            noRetry = await deployStatusPromise;
            if (!noRetry) {
                await sleep(5000);
            }
        }
        if (!noRetry) {
            throw new Error();
        }
    })
    .catch(err => {
        if (err) throw err;
    });
