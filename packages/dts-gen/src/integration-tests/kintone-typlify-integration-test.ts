/// <reference types="../../kintone" />
import { KintoneTyplifyApiTest } from "./kintone-typlify-api-test";

(() => {
    kintone.events.on(
        "app.record.index.show",
        (ev: any) => {
            KintoneTyplifyApiTest.assertKintoneBuiltinFunctions();
        }
    );
})();
