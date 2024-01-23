(function (PLUGIN_ID) {
  "use strict";

  var $form = document.querySelector(".js-submit-settings");
  var $cancelButton = document.querySelector(".js-cancel-button");
  var $message = document.querySelector(".js-text-message");
  if (!($form && $cancelButton && $message)) {
    throw new Error("Required elements do not exist.");
  }
  var config = kintone.plugin.app.getConfig(PLUGIN_ID);

  if (config.message) {
    $message.value = config.message;
  }
  $form.addEventListener("submit", function (e) {
    e.preventDefault();
    kintone.plugin.app.setConfig({ message: $message.value }, function () {
      alert("The plug-in settings have been saved. Please update the app!");
      window.location.href = "../../flow?app=" + kintone.app.getId();
    });
  });
  $cancelButton.addEventListener("click", function () {
    window.location.href = "../../" + kintone.app.getId() + "/plugin/";
  });
})(kintone.$PLUGIN_ID);
