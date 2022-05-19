// You can use the ESModules syntax and @kintone/rest-api-client without additional settings.
// import { KintoneRestAPIClient } from "@kintone/rest-api-client";

// @ts-expect-error
const PLUGIN_ID = kintone.$PLUGIN_ID;

const form = document.querySelector(".js-submit-settings");
if (form === null) {
  throw new Error("element (.js-submit-settings) does not exist");
}
const cancelButton = document.querySelector(".js-cancel-button");
if (cancelButton === null) {
  throw new Error("element (.js-cancel-button) does not exist");
}
const messageInput =
  document.querySelector<HTMLInputElement>(".js-text-message");
if (messageInput === null) {
  throw new Error("element (.js-text-message) does not exist");
}
const config = kintone.plugin.app.getConfig(PLUGIN_ID);

if (config.message) {
  messageInput.value = config.message;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  kintone.plugin.app.setConfig({ message: messageInput.value }, () => {
    alert("The plug-in settings have been saved. Please update the app!");
    window.location.href = "../../flow?app=" + kintone.app.getId();
  });
});
cancelButton.addEventListener("click", () => {
  window.location.href = "../../" + kintone.app.getId() + "/plugin/";
});
