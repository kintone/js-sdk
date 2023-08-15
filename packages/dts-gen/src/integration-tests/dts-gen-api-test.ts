import * as assert from "assert";

const assertKintoneBuiltinFunctions = () => {
  assertFunctionExistInKintoneTopLevel();
  assertFunctionExistInKintonePromise();
  assertFunctionExistInKintoneEvent();
  assertFunctionExistInKintoneAPI();
  assertFunctionExistInKintoneProxy();
  assetFunctionExistInKintoneApp();
  assertFunctionExistInKintoneAppRecord();
  assertFunctionExistInKintoneMobileApp();
  assertFunctionExistInKintoneMobileAppRecord();
  assertPortalAPI();
  assertSpaceAPI();
};

const assertFunction = (ref) => {
  assert.ok(ref);
  assert.ok(typeof ref === "function");
};

export const DTSGenApiTest = {
  assertKintoneBuiltinFunctions,
};

const assertFunctionExistInKintoneTopLevel = () => {
  assertFunction(kintone.getRequestToken);
  assertFunction(kintone.getLoginUser);
  assertFunction(kintone.getUiVersion);
};

const assertFunctionExistInKintonePromise = () => {
  assertFunction(kintone.Promise);
  assertFunction(kintone.Promise.all);
  assertFunction(kintone.Promise.resolve);
  assertFunction(kintone.Promise.reject);

  // kintone.api.url
  assert.ok(kintone.api.url("/k/v1/records").endsWith("/k/v1/records.json"));
  // only to check to compile success
  kintone.api.url("/k/v1/records", true);

  const okPromise = new kintone.Promise<number>((resolve) => resolve(1));

  assert.ok(okPromise);
  okPromise
    .then((resolved) => {
      assert.ok(resolved === 1);
    })
    .catch(() => {
      assert.fail("should not be called");
    });

  const ngPromise = new kintone.Promise<any>((_, reject) => reject(1));
  ngPromise
    .then(() => {
      assert.fail("should not be called");
    })
    .catch((rejected) => assert.ok(rejected === 1));

  kintone.Promise.resolve(1)
    .then((resolved) => assert.ok(resolved === 1))
    .catch(() => assert.fail("should not be called"));

  kintone.Promise.reject("reject")
    .then(() => assert.fail("should not be called"))
    .catch((reject) => assert.ok(reject === "reject"));

  kintone.Promise.all([
    kintone.Promise.resolve(1),
    kintone.Promise.resolve(2),
    kintone.Promise.resolve(3),
  ]).then((resolved) => {
    assert.ok(resolved.length === 3);
    assert.ok(resolved[0] === 1);
    assert.ok(resolved[1] === 2);
    assert.ok(resolved[2] === 3);
  });
};

const assertFunctionExistInKintoneEvent = () => {
  const e = kintone.events;
  assertFunction(e.on);
  assertFunction(e.off);
};

const assertFunctionExistInKintoneAPI = () => {
  const a = kintone.api;
  assertFunction(a);
  assertFunction(a.url);
  assertFunction(a.urlForGet);
  assertFunction(a.getConcurrencyLimit);
};

const assertFunctionExistInKintoneProxy = () => {
  const p = kintone.proxy;
  assertFunction(p);
  assertFunction(p.upload);
};

const assetFunctionExistInKintoneApp = () => {
  const app = kintone.app;
  assertFunction(app.getFieldElements);
  assertFunction(app.getHeaderMenuSpaceElement);
  assertFunction(app.getHeaderSpaceElement);
  assertFunction(app.getId);
  assertFunction(app.getLookupTargetAppId);
  assertFunction(app.getQuery);
  assertFunction(app.getQueryCondition);
  assertFunction(app.getRelatedRecordsTargetAppId);
};

const assertFunctionExistInKintoneAppRecord = () => {
  const r = kintone.app.record;
  assertFunction(r.get);
  assertFunction(r.getHeaderMenuSpaceElement);
  assertFunction(r.getFieldElement);
  assertFunction(r.getId);
  assertFunction(r.getSpaceElement);
  assertFunction(r.set);
  assertFunction(r.setFieldShown);
  assertFunction(r.setGroupFieldOpen);
};

const assertFunctionExistInKintoneMobileApp = () => {
  const ma = kintone.mobile.app;
  assertFunction(ma.getFieldElements);
  assertFunction(ma.getHeaderSpaceElement);
  assertFunction(ma.getId);
  assertFunction(ma.getLookupTargetAppId);
  assertFunction(ma.getQuery);
  assertFunction(ma.getQueryCondition);
  assertFunction(ma.getRelatedRecordsTargetAppId);
};

const assertFunctionExistInKintoneMobileAppRecord = () => {
  const mr = kintone.mobile.app.record;
  assertFunction(mr.get);
  assertFunction(mr.getId);
  assertFunction(mr.getFieldElement);
  assertFunction(mr.getSpaceElement);
  assertFunction(mr.set);
  assertFunction(mr.setFieldShown);
  assertFunction(mr.setGroupFieldOpen);
};

const assertPortalAPI = () => {
  assertFunction(kintone.portal.getContentSpaceElement);
  assertFunction(kintone.mobile.portal.getContentSpaceElement);
};

const assertSpaceAPI = () => {
  assertFunction(kintone.space.portal.getContentSpaceElement);
  assertFunction(kintone.mobile.space.portal.getContentSpaceElement);
};
