import * as fs from "fs";
// eslint-disable-next-line no-unused-vars
import { SetUpTestAppClient } from "../kintone/clients/setup-test-app-client";
import { DemoDatas } from "../kintone/clients/demo-datas";
import { log } from "../utils/logger";

type Client = SetUpTestAppClient;

const rethrow = err => Promise.reject(err);

async function createKintoneApp(
    client: Client,
    name: string
): Promise<string> {
    return client
        .requestCreateNewApp({ name })
        .then(resp => {
            log(`Preparing for App(ID:${resp.app})`);
            return resp.app;
        })
        .catch(rethrow);
}

async function addDemoField(client: Client, app: string) {
    log(`Preparing for field settings(ID:${app})`);
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
    metadata: {
        name: string;
        contentType: string;
    }
) {
    log(`Uploading ${metadata.name}`);
    return client
        .requestUploadFile({
            data,
            fileName: metadata.name,
            contentType: metadata.contentType,
        })
        .then(resp => {
            log(
                `Finish Uploading ${metadata.name}(${resp.fileKey})`
            );
            return resp.fileKey;
        })
        .catch(rethrow);
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
            })
            .catch(rethrow);
        if (successApps.length !== 1) {
            log(
                `Waiting for Deploy complete... ${i} times`
            );
            await sleep(3000);
        }
    }
}

async function addDemoRecord(
    client: Client,
    app: string,
    fileName: string
) {
    const DemoRecord = DemoDatas.DemoRecord;
    const record = Object.assign(DemoRecord);

    const upload1 = await client.requestUploadFile({
        data: fs.createReadStream(fileName),
        fileName: "sampleText",
        contentType: "plain/text",
    });
    record.Attachment.value.push({
        contentType: "plain/text",
        fileKey: upload1.fileKey,
        name: "text1",
    });

    const upload2 = await client.requestUploadFile({
        data: fs.createReadStream(fileName),
        fileName: "sampleText",
        contentType: "plain/text",
    });
    record.Table_0.value[0].value.Attachment_Table.value.push(
        {
            contentType: "plain/text",
            fileKey: upload2.fileKey,
            name: "text2",
        }
    );

    return client.requestAddRecord({ app, record });
}

export const SetupTestApp = {
    createKintoneApp,
    addDemoField,
    uploadFile,
    updateJsCustomize,
    deployApp,
    addDemoRecord,
};
