// @ts-expect-error
const PLUGIN_ID = kintone.$PLUGIN_ID;

const $form = document.querySelector(".js-submit-settings")!;
const $cancelButton = document.querySelector(".js-cancel-button")!;
const $message = document.querySelector<HTMLInputElement>(".js-text-message")!;
const config = kintone.plugin.app.getConfig(PLUGIN_ID);

if (config.message) {
  $message.value = config.message;
}

$form.addEventListener("submit", (e) => {
  e.preventDefault();
  kintone.plugin.app.setConfig({ message: $message.value }, () => {
    alert("The plug-in settings have been saved. Please update the app!");
    window.location.href = "../../flow?app=" + kintone.app.getId();
  });
});
$cancelButton.addEventListener("click", () => {
  window.location.href = "../../" + kintone.app.getId() + "/plugin/";
});
