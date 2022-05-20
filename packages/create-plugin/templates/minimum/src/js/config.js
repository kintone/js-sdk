jQuery.noConflict();

(function($, PLUGIN_ID) {
  'use strict';

  var $form = $('.js-submit-settings');
  var $cancelButton = $('.js-cancel-button');
  var $message = $('.js-text-message');
  if (!($form.length > 0 && $cancelButton.length > 0 && $message.length > 0)) {
    throw new Error('Required elements do not exist.');
  }
  var config = kintone.plugin.app.getConfig(PLUGIN_ID);

  if (config.message) {
    $message.val(config.message);
  }
  $form.on('submit', function(e) {
    e.preventDefault();
    kintone.plugin.app.setConfig({message: $message.val()}, function() {
      alert('The plug-in settings have been saved. Please update the app!');
      window.location.href = '../../flow?app=' + kintone.app.getId();
    });
  });
  $cancelButton.on('click', function() {
    window.location.href = '../../' + kintone.app.getId() + '/plugin/';
  });
})(jQuery, kintone.$PLUGIN_ID);
