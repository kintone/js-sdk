'use strict';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const UPLOAD_PPK = 'UPLOAD_PPK';
const UPLOAD_PLUGIN_START = 'UPLOADING_PLUGIN_START';
const UPLOAD_PLUGIN = 'UPLOAD_PLUGIN';
const UPLOAD_PLUGIN_FAILURE = 'UPLOAD_PLUGIN_FAILURE';
const CREATE_PLUGIN_ZIP = 'CREATE_PLUGIN_ZIP';
const CREATE_PLUGIN_ZIP_START = 'CREATE_PLUGIN_ZIP_START';
const CREATE_PLUGIN_ZIP_FAILURE = 'CREATE_PLUGIN_ZIP_FAILURE';
const RESET = 'RESET';

/**
 * Dispatch an action for uploading a ppk file
 * @param {string} fileName
 * @param {function(): Promise<string>} fileReader
 * @return {function(dispatch: function)}
 */
const uploadPPK = (fileName, fileReader) => dispatch => {
  fileReader().then(text => dispatch({
    type: UPLOAD_PPK,
    payload: {
      data: text,
      name: fileName,
    },
  }));
};

/**
 * Dispatch an action for uploading a plugin zip
 * @param {string} fileName
 * @param {function(): Promise<ArrayBuffer>} fileReader
 * @param {function(): Promise<void>} validateManifest
 * @return {function(dispatch: function)}
 */
const uploadPlugin = (fileName, fileReader, validateManifest) => dispatch => {
  dispatch({type: UPLOAD_PLUGIN_START});
  fileReader()
    .then(buffer => validateManifest(buffer).then(() => buffer))
    .then(
      buffer => {
        console.log(buffer);
        dispatch({
          type: UPLOAD_PLUGIN,
          payload: {
            data: buffer,
            name: fileName,
          },
        });
      },
      error => {
        dispatch({
          type: UPLOAD_PLUGIN_FAILURE,
          payload: error,
        });
      }
    );
};

/**
 * Dispatch an action for creating a plugin zip
 * @param {function(contents: ArrayBuffer, ppk: string): Promise<*>} generatePluginZip
 * @return {function(dispatch: function, getState: function)}
 */
const createPluginZip = generatePluginZip => (dispatch, getState) => {
  dispatch({
    type: CREATE_PLUGIN_ZIP_START,
  });
  const state = getState();
  Promise.all([
    generatePluginZip(state.contents.data, state.ppk.data),
    // It's to guarantee to wait 300ms to recognize creating a plugin zip an user
    delay(300),
  ]).then(
    ([result]) => {
      dispatch({
        type: CREATE_PLUGIN_ZIP,
        payload: result,
      });
    },
    error => {
      dispatch({
        type: CREATE_PLUGIN_ZIP_FAILURE,
        payload: error,
      });
    });
};

/**
 * Dispatch an action to reset the state
 * @return {{type: string}}
*/
const reset = () => ({
  type: RESET,
});

module.exports = {
  UPLOAD_PPK,
  UPLOAD_PLUGIN,
  UPLOAD_PLUGIN_START,
  UPLOAD_PLUGIN_FAILURE,
  CREATE_PLUGIN_ZIP,
  CREATE_PLUGIN_ZIP_START,
  CREATE_PLUGIN_ZIP_FAILURE,
  RESET,
  uploadPPK,
  uploadPlugin,
  reset,
  createPluginZip,
};
