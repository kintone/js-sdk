(function (PLUGIN_ID) {
  "use strict";

  var $form = document.querySelectorAll(".js-submit-settings");
  var $cancelButton = document.querySelectorAll(".js-cancel-button");
  var $message = document.querySelectorAll(".js-text-message");
  if (!($form.length > 0 && $cancelButton.length > 0 && $message.length > 0)) {
    throw new Error("Required elements do not exist.");
  }
  var config = kintone.plugin.app.getConfig(PLUGIN_ID);

  if (config.message) {
    $message[0].value = config.message;
  }
  $form[0].addEventListener("submit", function (e) {
    e.preventDefault();
    kintone.plugin.app.setConfig({ message: $message[0].value }, function () {
      alert("The plug-in settings have been saved. Please update the app!");
      window.location.href = "../../flow?app=" + kintone.app.getId();
    });
  });
  $cancelButton.forEach((element) => {
    element.addEventListener("click", function () {
      window.location.href = "../../" + kintone.app.getId() + "/plugin/";
    });
  });
})(kintone.$PLUGIN_ID);
