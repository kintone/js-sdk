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

const newAppPromise = client.requestCreateNewApp(input)
    .then(resp => Number(resp.app))
    .catch(err => {
        if(err) {
            throw err;
        }
        return err;
    });

const rethrow = err => {
    if (err) {
        throw err;
    }
};

const addFieldsPromise = newAppPromise
    .then(app => {
        const properties = DemoDatas.DemoDataFields;
        return client
            .requestAddFormField({
                app,
                properties,
            })
            .catch(rethrow);
    })
    .catch(rethrow);
// process.exit(0);
/** 
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
                    }).catch(err => reject(err));
            }
        );
    }
).catch(err => {
    if(err) {
        console.log(err);
        throw err;
    }
    return "";
})

const jsCustomizePromise = Promise.all([
    newAppPromise,
    fileUploadPromise,
])
    .then(([app, fileKey]) => {
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
    .catch(err => {
        if (err) throw err;
    });

const deployPromise = Promise.all([
    newAppPromise,
    addFieldsPromise,
    jsCustomizePromise,
])
    .then(([app, _1, _2]) => {
        const apps = [{ app }];
        return client.requestDepoy({ apps });
    })
    .catch(err => {
        if (err) throw err;
    });

Promise.all([newAppPromise, deployPromise])
    .then(([app, _1]) => {
        let noRetry = false;
        for (let i = 0; i < 10 && noRetry; i++) {
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
                .catch(err => false);
            Promise.all([deployStatusPromise])
                .then(([deploySuccess]) => {
                    noRetry = deploySuccess;
                    if (noRetry) {
                        Promise.all([
                            new Promise(resolve =>
                                setTimeout(resolve, 3000)
                            ),
                        ]);
                    }
                })
                .catch(err => {
                    if (err) throw err;
                });
        }
        if (!noRetry) {
            throw new Error();
        }
    })
    .catch(err => {
        if (err) throw err;
    });
*/
