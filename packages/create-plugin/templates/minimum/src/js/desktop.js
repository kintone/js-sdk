jQuery.noConflict();

(function($, PLUGIN_ID) {
    'use strict';

    kintone.events.on('app.record.index.show', function() {
        var spaceElement = kintone.app.getHeaderSpaceElement();
        var el = document.createElement('div');
        el.classList.add('plugin-space-element');
        el.textContent = 'Hello from kintone plugin! ID:' + PLUGIN_ID;
        spaceElement.appendChild(el);
    });

})(jQuery, kintone.$PLUGIN_ID);
