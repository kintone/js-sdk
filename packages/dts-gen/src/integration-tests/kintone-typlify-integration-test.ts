/// <reference types="../../kintone" />
/// <reference path="./testfields.d.ts" />
import * as assert from "assert";

import { KintoneTyplifyApiTest } from "./kintone-typlify-api-test";
import { KintoneTyplifyFieldsTest } from "./kintone-typlify-fields-test";

interface Event {
    appId: number;
    viewId: number;
    viewType: string;
    viewName: string;
    offset: number;
    size: number;
    date: string;
    records: kintone.types.SavedTestFields[];
}
(() => {
    kintone.events.on(
        "app.record.index.show",
        (ev: Event) => {
            KintoneTyplifyApiTest.assertKintoneBuiltinFunctions();
            KintoneTyplifyFieldsTest.assertFieldTypes(
                ev.records[0]
            );

            assertNotUndefined(ev.appId);
            assertNotUndefined(ev.viewType);
            assertNotUndefined(ev.viewId);
            assertNotUndefined(ev.viewName);
            assertNotUndefined(ev.offset);
            assertNotUndefined(ev.size);
            assertNotUndefined(ev.date);
        }
    );

    function assertNotUndefined(ref) {
        assert.ok(ref !== undefined);
    }
})();
