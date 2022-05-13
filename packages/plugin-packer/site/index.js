"use strict";

require("setimmediate"); // polyfill

const { configureStore } = require("@reduxjs/toolkit");
const thunk = require("redux-thunk").default;
const logger = require("redux-logger").default;

const {
  $,
  $$,
  fileMapToBuffer,
  listen,
  readText,
  readArrayBuffer,
  createFileHanlder,
} = require("./dom");
const View = require("./view");

const { reducer } = require("./reducer");
const {
  uploadPPK,
  uploadPlugin,
  createPluginZip,
  reset,
  uploadFailure,
} = require("./action");
const {
  generatePluginZip,
  validatePlugin,
  revokePluginUrls,
} = require("./plugin");

const $ppkFileUploader = $(".js-upload-ppk .js-file-upload");
const $zipFileUploader = $(".js-upload-zip .js-file-upload");
const $$fileUploader = $$(".js-file-upload");

const $$UploadArea = $$(".js-upload");
const $zipDropArea = $(".js-upload-zip");
const $ppkDropArea = $(".js-upload-ppk");

const $createBtn = $(".js-create-btn");
const $createLoadingBtn = $(".js-create-loading-btn");
const $clearBtn = $(".js-clear-btn");

const $$fileUploaders = $$(".js-file-upload");

const $zipOkIcon = $(".js-zip-ok-icon");
const $ppkOkIcon = $(".js-ppk-ok-icon");

const $uploadZipLink = $(".js-upload-zip-link");
const $uploadPPKLink = $(".js-upload-ppk-link");

const $download = $(".js-download");
const $downloadPlugin = $(".js-download-plugin");
const $downloadPluginId = $(".js-download-plugin-id");
const $downloadPPK = $(".js-download-ppk");

const $error = $(".js-error");
const $errorMessages = $(".js-error-messages");

const $zipFileName = $(".js-zip-file-name");
const $ppkFileName = $(".js-ppk-file-name");

const view = new View({
  createLoadingBtn: $createLoadingBtn,
  createBtn: $createBtn,
  zipDropArea: $zipDropArea,
  ppkDropArea: $ppkDropArea,
  ppkOkIcon: $ppkOkIcon,
  error: $error,
  download: $download,
  downloadPluginId: $downloadPluginId,
  downloadPlugin: $downloadPlugin,
  downloadPPK: $downloadPPK,
  errorMessages: $errorMessages,
  zipOkIcon: $zipOkIcon,
  zipFileName: $zipFileName,
  ppkFileName: $ppkFileName,
});

const middlewares = [thunk];
if (process.env.NODE_ENV !== "production") {
  middlewares.push(logger);
}

const store = configureStore({
  reducer,
  middleware: middlewares,
});

store.subscribe(() => {
  view.render(store.getState());
});

const uploadPluginZipHandler = createFileHanlder((promise) => {
  promise
    .then((result) => {
      if (result instanceof File) {
        store.dispatch(
          uploadPlugin(
            result.name,
            () => readArrayBuffer(result),
            validatePlugin
          )
        );
        // Uploading a directory
      } else if (result.entries instanceof Map) {
        fileMapToBuffer(result.entries).then((buffer) => {
          store.dispatch(
            uploadPlugin(
              result.name,
              () => Promise.resolve(buffer),
              validatePlugin
            )
          );
        });
      } else {
        throw new Error("Something went wrong.");
      }
    })
    .catch((error) => {
      store.dispatch(uploadFailure(error));
    });
});

const uploadPPKHanlder = createFileHanlder((promise) => {
  promise
    .then((result) => {
      if (result instanceof File) {
        store.dispatch(uploadPPK(result.name, () => readText(result)));
        // Uploading a directory
      } else if (result.entries instanceof Map) {
        store.dispatch(
          uploadFailure(new Error("secret file should be a text file"))
        );
      } else {
        throw new Error("Something went wrong.");
      }
    })
    .catch((error) => {
      store.dispatch(uploadFailure(error));
    });
});

// Handle a file upload
listen($zipFileUploader, "change", uploadPluginZipHandler);
listen($ppkFileUploader, "change", uploadPPKHanlder);
listen($zipDropArea, "drop", uploadPluginZipHandler);
listen($ppkDropArea, "drop", uploadPPKHanlder);
// Hack to allow us to reupload the same file
listen($$fileUploader, "click", (e) => {
  e.target.value = null;
});

// Handle click a button
listen($createBtn, "click", () => {
  const state = store.getState();
  if (!state.contents.data) {
    return;
  }
  revokePluginUrls(state.plugin);
  store.dispatch(createPluginZip(generatePluginZip));
});
listen($clearBtn, "click", () => {
  $$fileUploaders.forEach((el) => {
    el.value = null;
  });
  store.dispatch(reset());
});

// Handle a click for a select file
listen($uploadZipLink, "click", (e) => {
  e.preventDefault();
  $zipFileUploader.click();
});
listen($uploadPPKLink, "click", (e) => {
  e.preventDefault();
  $ppkFileUploader.click();
});

// Hanlde a drag and drop
listen($$UploadArea, "dragover", (e) => {
  e.preventDefault();
  view.decorateDragOver(e.currentTarget);
});
listen($$UploadArea, "dragleave", (e) => {
  view.decorateDragLeave(e.currentTarget);
});

store.dispatch({ type: "__INIT__" });
