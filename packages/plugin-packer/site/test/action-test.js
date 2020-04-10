"use strict";

const assert = require("assert");
const sinon = require("sinon");

const {
  UPLOAD_PPK,
  UPLOAD_PPK_START,
  UPLOAD_FAILURE,
  UPLOAD_PLUGIN,
  UPLOAD_PLUGIN_START,
  CREATE_PLUGIN_ZIP,
  CREATE_PLUGIN_ZIP_START,
  CREATE_PLUGIN_ZIP_FAILURE,
  RESET,
  uploadFailure,
  uploadPPK,
  uploadPlugin,
  reset,
  createPluginZip,
} = require("../action");

describe("action", () => {
  let dispatch;
  beforeEach(() => {
    dispatch = sinon.spy();
  });
  afterEach(() => {});
  describe("uploadFailure", () => {
    it("should dispatch an UPLOAD_FAILURE action with an error", () => {
      const error = { message: "error" };
      assert.deepStrictEqual(uploadFailure(error), {
        type: UPLOAD_FAILURE,
        payload: error,
      });
    });
  });
  describe("uploadPPK", () => {
    it("should dispatch UPLOAD_PPK_START action", () => {
      const promise = Promise.resolve("value");
      uploadPPK("hoge.ppk", () => promise)(dispatch);
      assert(dispatch.calledOnce);
      assert.deepStrictEqual(dispatch.getCall(0).args, [
        { type: UPLOAD_PPK_START },
      ]);
    });
    it("should dispatch an UPLOAD_PPK action with payload including data and name properties", () => {
      const promise = Promise.resolve("value");
      uploadPPK("hoge.ppk", () => promise)(dispatch);
      return promise.then(() => {
        assert.equal(dispatch.callCount, 2);
        assert.deepStrictEqual(dispatch.getCall(1).args, [
          {
            type: UPLOAD_PPK,
            payload: {
              data: "value",
              name: "hoge.ppk",
            },
          },
        ]);
      });
    });
    it("should dispatch UPLOAD_FAILURE action if fileReader was failure", (done) => {
      uploadPPK("hoge.ppk", () => Promise.reject("ng"))(dispatch);
      setTimeout(() => {
        assert.equal(dispatch.callCount, 2);
        assert.deepStrictEqual(dispatch.getCall(1).args, [
          {
            type: UPLOAD_FAILURE,
            payload: "ng",
          },
        ]);
        done();
      });
    });
  });
  describe("uploadPlugin", () => {
    it("should dispatch UPLOAD_PLUGIN_START action", () => {
      uploadPlugin(
        "hoge.zip",
        () => Promise.resolve("ok"),
        () => Promise.resolve()
      )(dispatch);
      assert(dispatch.calledOnce);
      assert.deepStrictEqual(dispatch.getCall(0).args, [
        { type: UPLOAD_PLUGIN_START },
      ]);
    });
    it("should dispatch UPLOAD_PLUGIN action if validateManifest was success", (done) => {
      const validateManifestStub = sinon.stub().returns(Promise.resolve());
      uploadPlugin(
        "hoge.zip",
        () => Promise.resolve("ok"),
        validateManifestStub
      )(dispatch);
      // In order to guarantee to execute assertion after uploadPlugin has finished
      setTimeout(() => {
        assert.equal(dispatch.callCount, 2);
        assert.equal(validateManifestStub.getCall(0).args[0], "ok");
        assert.deepStrictEqual(dispatch.getCall(1).args, [
          {
            type: UPLOAD_PLUGIN,
            payload: {
              data: "ok",
              name: "hoge.zip",
            },
          },
        ]);
        done();
      });
    });
    it("should dispatch UPLOAD_FAILURE action if validateManifest was failure", (done) => {
      const validateManifestStub = sinon
        .stub()
        .returns(Promise.reject("error"));
      uploadPlugin(
        "hoge.zip",
        () => Promise.resolve("ng"),
        validateManifestStub
      )(dispatch);
      // In order to guarantee to execute assertion after uploadPlugin has finished
      setTimeout(() => {
        assert.equal(dispatch.callCount, 2);
        assert.equal(validateManifestStub.getCall(0).args[0], "ng");
        assert.deepStrictEqual(dispatch.getCall(1).args, [
          {
            type: UPLOAD_FAILURE,
            payload: "error",
          },
        ]);
        done();
      });
    });
  });
  describe("createPluginZip", () => {
    it("should dispatch CREATE_PLUGIN_ZIP_START action", () => {
      const getState = () => ({
        contents: {},
        ppk: {},
      });
      createPluginZip(() => Promise.resolve)(dispatch, getState);
      assert.deepStrictEqual(dispatch.getCall(0).args, [
        { type: CREATE_PLUGIN_ZIP_START },
      ]);
    });
  });
  it("should dispatch CREATE_PLUGIN_ZIP action with the payload if generatePluginZip was success", (done) => {
    const getState = () => ({
      contents: {},
      ppk: {},
    });
    createPluginZip(() => Promise.resolve({ foo: "bar" }))(dispatch, getState);
    setTimeout(() => {
      assert.equal(dispatch.callCount, 2);
      assert.deepStrictEqual(dispatch.getCall(1).args, [
        {
          type: CREATE_PLUGIN_ZIP,
          payload: {
            foo: "bar",
          },
        },
      ]);
      done();
    }, 500);
  });
  it("should dispatch CREATE_PLUGIN_ZIP_FAILURE action with the error if generatePluginZip was failure", (done) => {
    const getState = () => ({
      contents: {},
      ppk: {},
    });
    createPluginZip(() => Promise.reject("error"))(dispatch, getState);
    setTimeout(() => {
      assert.equal(dispatch.callCount, 2);
      assert.deepStrictEqual(dispatch.getCall(1).args, [
        {
          type: CREATE_PLUGIN_ZIP_FAILURE,
          payload: "error",
        },
      ]);
      done();
    }, 500);
  });
  describe("reset", () => {
    it("should dispatch RESET action", () => {
      assert.deepStrictEqual(reset(), {
        type: RESET,
      });
    });
  });
});
