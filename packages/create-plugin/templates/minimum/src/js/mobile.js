jQuery.noConflict();

(function($, PLUGIN_ID) {
    'use strict';

    kintone.events.on('mobile.app.record.index.show', function() {
        kintone.mobile.app.getHeaderSpaceElement().textContent = 'Hello from kintone plugin! ID:' + PLUGIN_ID;
    });

})(jQuery, kintone.$PLUGIN_ID);
