jQuery.noConflict();

(function($, PLUGIN_ID) {
    'use strict';

    var $form = $('.js-submit-settings');
    var $message = $('.js-text-message');

    function getSettingsUrl() {
        return '/k/admin/app/flow?app=' + kintone.app.getId();
    }

    var config = kintone.plugin.app.getConfig(PLUGIN_ID);
    if (config.message) {
        $message.val(config.message);
    }
    $form.on('submit', function(e) {
        e.preventDefault();
        kintone.plugin.app.setConfig({message: $message.val()}, function() {
            alert('The plug-in settings have been saved. Please update the app!');
            window.location.href = getSettingsUrl();
        });
    });
})(jQuery, kintone.$PLUGIN_ID);
