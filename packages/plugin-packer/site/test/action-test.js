"use strict";

import { describe, it, expect, vi, beforeEach } from "vitest";

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
    dispatch = vi.fn();
  });
  describe("uploadFailure", () => {
    it("should dispatch an UPLOAD_FAILURE action with an error", () => {
      const error = { message: "error" };
      expect(uploadFailure(error)).toStrictEqual({
        type: UPLOAD_FAILURE,
        payload: error,
      });
    });
  });
  describe("uploadPPK", () => {
    it("should dispatch UPLOAD_PPK_START action", () => {
      const promise = Promise.resolve("value");
      uploadPPK("hoge.ppk", () => promise)(dispatch);
      expect(dispatch.mock.calls.length).toBe(1);
      // https://github.com/facebook/jest/issues/7929
      expect([...dispatch.mock.calls[0]]).toStrictEqual([
        { type: UPLOAD_PPK_START },
      ]);
    });
    it("should dispatch an UPLOAD_PPK action with payload including data and name properties", async () => {
      const promise = Promise.resolve("value");
      uploadPPK("hoge.ppk", () => promise)(dispatch);
      await promise;
      expect(dispatch.mock.calls.length).toBe(2);
      expect([...dispatch.mock.calls[1]]).toStrictEqual([
        {
          type: UPLOAD_PPK,
          payload: {
            data: "value",
            name: "hoge.ppk",
          },
        },
      ]);
    });
    it("should dispatch UPLOAD_FAILURE action if fileReader was failure", async () => {
      uploadPPK("hoge.ppk", () => Promise.reject("ng"))(dispatch);
      await vi.waitFor(() => {
        expect(dispatch.mock.calls.length).toBe(2);
      });
      expect([...dispatch.mock.calls[1]]).toStrictEqual([
        {
          type: UPLOAD_FAILURE,
          payload: "ng",
        },
      ]);
    });
  });
  describe("uploadPlugin", () => {
    it("should dispatch UPLOAD_PLUGIN_START action", () => {
      uploadPlugin(
        "hoge.zip",
        () => Promise.resolve("ok"),
        () => Promise.resolve(),
      )(dispatch);
      expect(dispatch.mock.calls.length).toBe(1);
      expect([...dispatch.mock.calls[0]]).toStrictEqual([
        { type: UPLOAD_PLUGIN_START },
      ]);
    });
    it("should dispatch UPLOAD_PLUGIN action if validateManifest was success", async () => {
      const validateManifestStub = vi.fn().mockResolvedValue();
      uploadPlugin(
        "hoge.zip",
        () => Promise.resolve("ok"),
        validateManifestStub,
      )(dispatch);
      await vi.waitFor(() => {
        expect(dispatch.mock.calls.length).toBe(2);
      });
      expect(validateManifestStub.mock.calls[0][0]).toBe("ok");
      expect([...dispatch.mock.calls[1]]).toStrictEqual([
        {
          type: UPLOAD_PLUGIN,
          payload: {
            data: "ok",
            name: "hoge.zip",
          },
        },
      ]);
    });
    it("should dispatch UPLOAD_FAILURE action if validateManifest was failure", async () => {
      const validateManifestStub = vi.fn().mockRejectedValue("error");
      uploadPlugin(
        "hoge.zip",
        () => Promise.resolve("ng"),
        validateManifestStub,
      )(dispatch);
      await vi.waitFor(() => {
        expect(dispatch.mock.calls.length).toBe(2);
      });
      expect(validateManifestStub.mock.calls[0][0]).toBe("ng");
      expect([...dispatch.mock.calls[1]]).toStrictEqual([
        {
          type: UPLOAD_FAILURE,
          payload: "error",
        },
      ]);
    });
  });
  describe("createPluginZip", () => {
    it("should dispatch CREATE_PLUGIN_ZIP_START action", () => {
      const getState = () => ({
        contents: {},
        ppk: {},
      });
      createPluginZip(() => Promise.resolve)(dispatch, getState);
      expect([...dispatch.mock.calls[0]]).toStrictEqual([
        { type: CREATE_PLUGIN_ZIP_START },
      ]);
    });
  });
  it("should dispatch CREATE_PLUGIN_ZIP action with the payload if generatePluginZip was success", async () => {
    const getState = () => ({
      contents: {},
      ppk: {},
    });
    createPluginZip(() => Promise.resolve({ foo: "bar" }))(dispatch, getState);
    await vi.waitFor(() => {
      expect(dispatch.mock.calls.length).toBe(2);
    });
    expect([...dispatch.mock.calls[1]]).toStrictEqual([
      {
        type: CREATE_PLUGIN_ZIP,
        payload: {
          foo: "bar",
        },
      },
    ]);
  });
  it("should dispatch CREATE_PLUGIN_ZIP_FAILURE action with the error if generatePluginZip was failure", async () => {
    const getState = () => ({
      contents: {},
      ppk: {},
    });
    createPluginZip(() => Promise.reject("error"))(dispatch, getState);
    await vi.waitFor(() => {
      expect(dispatch.mock.calls.length).toBe(2);
    });
    expect([...dispatch.mock.calls[1]]).toStrictEqual([
      {
        type: CREATE_PLUGIN_ZIP_FAILURE,
        payload: "error",
      },
    ]);
  });
  describe("reset", () => {
    it("should dispatch RESET action", () => {
      expect(reset()).toStrictEqual({
        type: RESET,
      });
    });
  });
});
