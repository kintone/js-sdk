jQuery.noConflict();

(function($, PLUGIN_ID) {
    'use strict';

    document.querySelector('.plugin-config').textContent = 'Hello from kintone plugin! ID:' + PLUGIN_ID;

})(jQuery, kintone.$PLUGIN_ID);
