"use strict";

const { createDownloadUrls } = require("./plugin");
const {
  UPLOAD_FAILURE,
  UPLOAD_PPK,
  UPLOAD_PPK_START,
  UPLOAD_PLUGIN,
  UPLOAD_PLUGIN_START,
  CREATE_PLUGIN_ZIP,
  CREATE_PLUGIN_ZIP_START,
  CREATE_PLUGIN_ZIP_FAILURE,
  RESET
} = require("./action");

const getInitialState = () => ({
  contents: {
    data: null,
    name: null
  },
  ppk: {
    data: null,
    name: null
  },
  plugin: {
    id: null,
    url: {
      contents: null,
      ppk: null
    }
  },
  error: null,
  loading: false
});

/**
 * Reducer for an application
 * @param {Object} state
 * @param {{type: string, payload: *}} action
 * @return {Object}
 */
const reducer = (state = getInitialState(), action) => {
  switch (action.type) {
    case UPLOAD_PPK_START: {
      const { ppk, plugin } = getInitialState();
      return Object.assign({}, state, {
        ppk,
        plugin,
        error: null
      });
    }
    case UPLOAD_PPK:
      return Object.assign({}, state, {
        ppk: action.payload
      });
    case UPLOAD_PLUGIN_START: {
      const { contents, plugin } = getInitialState();
      return Object.assign({}, state, {
        contents,
        plugin,
        error: null
      });
    }
    case UPLOAD_PLUGIN:
      return Object.assign({}, state, {
        contents: action.payload
      });
    case CREATE_PLUGIN_ZIP_START:
      return Object.assign({}, state, {
        plugin: getInitialState().plugin,
        error: null,
        loading: true
      });
    case CREATE_PLUGIN_ZIP:
      return Object.assign({}, state, {
        ppk: {
          data: action.payload.privateKey,
          name: state.ppk.name || `${action.payload.id}.ppk`
        },
        plugin: {
          id: action.payload.id,
          url: createDownloadUrls(action.payload)
        },
        loading: false
      });
    case UPLOAD_FAILURE:
    case CREATE_PLUGIN_ZIP_FAILURE:
      return Object.assign({}, state, {
        error: action.payload,
        loading: false
      });
    case RESET:
      return getInitialState();
    default:
      return state;
  }
};

/**
 * Return a basename of download files
 * @param {Object} state
 * @return {string}
 */
const getPluginBaseName = state =>
  `${state.contents.name.replace(/\.\w+$/, "")}.${state.plugin.id}`;

/**
 * Return a filename for a plugin zip
 * @param {Object} state
 * @return {string}
 */
const getDownloadPluginZipName = state =>
  `${getPluginBaseName(state)}.plugin.zip`;

/**
 * Return a filename for a secret file(ppk)
 * @param {Object} state
 * @return {string}
 */
const getDownloadPPKFileName = state =>
  `${getPluginBaseName(state)}.private.ppk`;

module.exports = {
  reducer,
  getDownloadPluginZipName,
  getDownloadPPKFileName
};
