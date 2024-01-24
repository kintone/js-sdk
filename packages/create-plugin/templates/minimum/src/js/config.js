(function (PLUGIN_ID) {
  "use strict";

  let formEl = document.querySelector(".js-submit-settings");
  let cancelButtonEl = document.querySelector(".js-cancel-button");
  let messageEl = document.querySelector(".js-text-message");
  if (
    !(formEl.length > 0 && cancelButtonEl.length > 0 && messageEl.length > 0)
  ) {
    throw new Error("Required elements do not exist.");
  }

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (config.message) {
    messageEl.value = config.message;
  }

  formEl.addEventListener("submit", function (e) {
    e.preventDefault();
    kintone.plugin.app.setConfig({ message: messageEl.value }, function () {
      alert("The plug-in settings have been saved. Please update the app!");
      window.location.href = "../../flow?app=" + kintone.app.getId();
    });
  });

  cancelButtonEl.addEventListener("click", function () {
    window.location.href = "../../" + kintone.app.getId() + "/plugin/";
  });
})(kintone.$PLUGIN_ID);
