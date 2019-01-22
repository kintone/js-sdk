import * as fs from "fs";

import { IntegrationTestPrepareClient } from "../kintone/clients/integration-test-prepare-client";
import { DemoDatas } from "../kintone/clients/demo-datas";

type Client = IntegrationTestPrepareClient;

const rethrow = err => {
    if (err) {
        throw err;
    }
};

async function createKintoneApp(
    client: Client,
    name: string
): Promise<string> {
    return client
        .requestCreateNewApp({ name })
        .then(resp => {
            console.log(
                `Preparing for App(ID:${resp.app})`
            );
            return resp.app;
        });
}

async function addDemoField(client: Client, app: string) {
    console.log(`Preparing for field settings(ID:${app})`);
    const properties = DemoDatas.DemoDataFields;
    return client
        .requestAddFormField({
            app,
            properties,
        })
        .catch(rethrow);
}

async function uploadFile(
    client: Client,
    data: fs.ReadStream,
    jsCutomizeFileName: string
) {
    console.log(`Uploading ${jsCutomizeFileName}`);
    return client
        .requestUploadFile({
            data,
            fileName: jsCutomizeFileName,
        })
        .then(resp => {
            console.log(
                `Finish Uploading ${jsCutomizeFileName}(${
                    resp.fileKey
                })`
            );
            return resp.fileKey;
        });
}

async function sleep(msec) {
    return new Promise(resolve =>
        setTimeout(resolve, msec)
    );
}

async function updateJsCustomize(
    client: Client,
    app: string,
    fileKey: string
) {
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
        .catch(rethrow);
}

async function deployApp(client: Client, app: string) {
    const apps = [{ app }];
    await client.requestDepoy({ apps });
    for (const i of [1, 2, 3, 4, 5]) {
        const successApps = await client
            .requestGetDeployStatus({ apps: [app] })
            .then(resp => {
                return resp.apps.filter(
                    app => app.status === "SUCCESS"
                );
            });
        if (successApps.length === 1) {
            console.log("Waiting for Deploy complete...");
            sleep(3000);
        }
    }
}

export const SetupTestApp = {
    createKintoneApp,
    addDemoField,
    uploadFile,
    updateJsCustomize,
    deployApp,
};
