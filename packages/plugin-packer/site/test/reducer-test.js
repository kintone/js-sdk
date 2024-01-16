"use strict";

const {
  reducer,
  getDownloadPluginZipName,
  getDownloadPPKFileName,
} = require("../reducer");
const {
  UPLOAD_FAILURE,
  UPLOAD_PPK_START,
  UPLOAD_PPK,
  UPLOAD_PLUGIN_START,
  UPLOAD_PLUGIN,
  CREATE_PLUGIN_ZIP_START,
  CREATE_PLUGIN_ZIP,
  CREATE_PLUGIN_ZIP_FAILURE,
  RESET,
} = require("../action");

const expectedInitialState = {
  contents: {
    data: null,
    name: null,
  },
  ppk: {
    data: null,
    name: null,
  },
  plugin: {
    id: null,
    url: {
      contents: null,
      ppk: null,
    },
  },
  error: null,
  loading: false,
};

describe("reducer", () => {
  beforeEach(() => {
    global.URL = {
      createObjectURL: (data) => data,
    };
  });
  describe("initial state", () => {
    it("should be initialized all values", () => {
      expect(reducer(undefined, { type: "INIT_TEST" })).toStrictEqual(
        expectedInitialState,
      );
    });
  });
  describe("UPLOAD_PPK_START", () => {
    it("should reset state.ppk, state.plugin and state.error", () => {
      const state = {
        contents: {
          data: "hoge",
          name: "bar",
        },
        ppk: {
          data: "ok",
          name: "okok",
        },
        plugin: {
          id: "hoge",
        },
        error: "hoge",
      };
      expect(reducer(state, { type: UPLOAD_PPK_START })).toStrictEqual({
        contents: {
          data: "hoge",
          name: "bar",
        },
        ppk: {
          data: null,
          name: null,
        },
        plugin: {
          id: null,
          url: {
            contents: null,
            ppk: null,
          },
        },
        error: null,
      });
    });
  });
  describe("UPLOAD_PPK", () => {
    it("should update state.ppk with the payload", () => {
      const state = {
        ppk: null,
      };
      const ppk = { data: [], name: "hgoe.ppk" };
      expect(reducer(state, { type: UPLOAD_PPK, payload: ppk })).toStrictEqual({
        ppk,
      });
    });
  });
  describe("UPLOAD_PLUGIN_START", () => {
    it("should reset state.contents, state.plugin and state.error", () => {
      const state = {
        contents: {
          data: "hoge",
          name: "bar",
        },
        ppk: {
          data: "ok",
          name: "okok",
        },
        plugin: {
          id: "hoge",
        },
        error: "hoge",
      };
      expect(reducer(state, { type: UPLOAD_PLUGIN_START })).toStrictEqual({
        contents: {
          data: null,
          name: null,
        },
        ppk: {
          data: "ok",
          name: "okok",
        },
        plugin: {
          id: null,
          url: {
            contents: null,
            ppk: null,
          },
        },
        error: null,
      });
    });
  });
  describe("UPLOAD_PLUGIN", () => {
    it("should update satte.contents with payload", () => {
      const state = {
        contents: null,
      };
      const contents = { data: [], name: "hoge.zip" };
      expect(
        reducer(state, { type: UPLOAD_PLUGIN, payload: contents }),
      ).toStrictEqual({
        contents,
      });
    });
  });
  describe("CREATE_PLUGIN_ZIP_START", () => {
    it("should reset state.plugin and state.error and update state.loging true", () => {
      const state = {
        contents: "contents",
        ppk: "ppk",
        plugin: {
          id: "hoge",
          url: {
            contents: "hogehoge",
            ppk: "foo",
          },
        },
        error: "error",
        loading: false,
      };
      expect(reducer(state, { type: CREATE_PLUGIN_ZIP_START })).toStrictEqual({
        contents: "contents",
        ppk: "ppk",
        plugin: expectedInitialState.plugin,
        error: null,
        loading: true,
      });
    });
  });
  describe("CREATE_PLUGIN_ZIP", () => {
    it("should update state.plugin and state.ppk if it is necessary, and update loading false", () => {
      const state = {
        ppk: {
          data: null,
          name: null,
        },
        plugin: {
          id: null,
          url: {
            contents: null,
            ppk: null,
          },
          loading: true,
        },
      };
      const action = {
        type: CREATE_PLUGIN_ZIP,
        payload: {
          privateKey: "secret",
          plugin: "plugin data",
          id: "abcd",
        },
      };
      const newState = reducer(state, action);
      expect(newState.ppk).toStrictEqual({
        data: "secret",
        name: "abcd.ppk",
      });
      expect(newState.plugin.id).toBe("abcd");
      expect(newState.plugin.url.contents).toBeInstanceOf(Blob);
      expect(newState.plugin.url.ppk).toBeInstanceOf(Blob);
      expect(newState.loading).toBe(false);
    });
  });
  describe("UPLOAD_FAILURE and CREATE_PLUGIN_ZIP_FAILURE", () => {
    it("should update state.error and update state.loding false", () => {
      const state = {
        error: null,
        loading: true,
      };
      expect(
        reducer(state, { type: UPLOAD_FAILURE, payload: "error" }),
      ).toStrictEqual({
        error: "error",
        loading: false,
      });
      expect(
        reducer(state, { type: CREATE_PLUGIN_ZIP_FAILURE, payload: "error" }),
      ).toStrictEqual({
        error: "error",
        loading: false,
      });
    });
  });
  describe("RESET", () => {
    it("should reset all values", () => {
      const state = "dirty";
      expect(reducer(state, { type: RESET })).toStrictEqual(
        expectedInitialState,
      );
    });
  });
  describe("getDownloadPluginZipName", () => {
    it("should return a filename to download a plugin zip", () => {
      expect(
        getDownloadPluginZipName({
          contents: {
            name: "awesome-plugin.zip",
          },
          plugin: {
            id: "abcd",
          },
        }),
      ).toBe("awesome-plugin.abcd.plugin.zip");
    });
  });
  describe("getDownloadPPKFileName", () => {
    it("should return a filename to download a private key", () => {
      expect(
        getDownloadPPKFileName({
          contents: {
            name: "awesome-plugin.zip",
          },
          ppk: {
            name: "secret.ppk",
          },
          plugin: {
            id: "abcd",
          },
        }),
      ).toBe("awesome-plugin.abcd.private.ppk");
    });
  });
});
