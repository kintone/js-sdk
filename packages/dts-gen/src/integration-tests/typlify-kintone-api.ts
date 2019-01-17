/// <reference types="../../kintone" />
import * as assert from "assert";

(() => {
    kintone.events.on(
        "app.record.create.show",
        (event: any) => {
            // assert function exists in kintone top-level
            assertFunction(kintone.getRequestToken);
            assertFunction(kintone.getLoginUser);
            assertFunction(kintone.getUiVersion);

            // assert function exists in kintone.Promise
            assertFunction(kintone.Promise);
            const okPromise = new kintone.Promise<
                number,
                any
            >(resolve => resolve(1));

            assert.ok(okPromise);
            okPromise.then(resolved => {
                assert.ok(resolved === 1);
            });

            const ngPromise = new kintone.Promise<
                any,
                number
            >((_, reject) => reject(1));
            ngPromise.catch(rejected =>
                assert.ok(rejected === 1)
            );

            kintone.Promise.resolve(1).then(resolved =>
                assert.ok(resolved === 1)
            );

            kintone.Promise.reject("reject").catch(reject =>
                assert.ok(reject === "reject")
            );

            assertFunction(kintone.Promise.all);
            assertFunction(kintone.Promise.resolve);
            assertFunction(kintone.Promise.reject);

            // assert function exists in kintone.events
            const e = kintone.events;
            assertFunction(e.on);
            assertFunction(e.off);

            // assert function exists in kintone.api
            const a = kintone.api;
            assertFunction(a);
            assertFunction(a.url);
            assertFunction(a.urlForGet);
            assertFunction(a.getConcurrencyLimit);

            // assert function exists in kintone.proxy
            const p = kintone.proxy;
            assertFunction(p);
            assertFunction(p.upload);

            // assert function exists in kintone.app
            const app = kintone.app;
            assertFunction(app.getFieldElements);
            assertFunction(app.getHeaderMenuSpaceElement);
            assertFunction(app.getHeaderSpaceElement);
            assertFunction(app.getId);
            assertFunction(app.getLookupTargetAppId);
            assertFunction(app.getQuery);
            assertFunction(app.getQueryCondition);
            assertFunction(
                app.getRelatedRecordsTargetAppId
            );

            // assert function exists in kintone.app.record
            const r = kintone.app.record;
            assertFunction(r.get);
            assertFunction(r.getFieldElement);
            assertFunction(r.getId);
            assertFunction(r.getSpaceElement);
            assertFunction(r.set);
            assertFunction(r.setFieldShown);
            assertFunction(r.setGroupFieldOpen);

            // assert function exists in kintone.mobile.app
            const ma = kintone.mobile.app;
            assertFunction(ma.getHeaderSpaceElement);
            assertFunction(ma.getId);
            assertFunction(ma.getLookupTargetAppId);
            assertFunction(ma.getQuery);
            assertFunction(ma.getQueryCondition);
            assertFunction(ma.getRelatedRecordsTargetAppId);

            // assert function exists in kintone.mobile.app.record
            const mr = kintone.mobile.app.record;
            assertFunction(mr.get);
            assertFunction(mr.getId);
            assertFunction(mr.getSpaceElement);
            assertFunction(mr.set);
            assertFunction(mr.setFieldShown);
            assertFunction(mr.setGroupFieldOpen);
        }
    );

    function assertFunction(ref) {
        assert.ok(ref);
        assert.ok(typeof ref === "function");
    }
})();
