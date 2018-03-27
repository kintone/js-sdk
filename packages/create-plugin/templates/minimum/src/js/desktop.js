jQuery.noConflict();

(function($, PLUGIN_ID) {
    'use strict';

    kintone.events.on('app.record.index.show', function() {
        var spaceElement = kintone.app.getHeaderSpaceElement();
        spaceElement.classList.add('plugin-space-element');
        spaceElement.textContent = 'Hello from kintone plugin! ID:' + PLUGIN_ID;
    });

})(jQuery, kintone.$PLUGIN_ID);
