jQuery.noConflict();
(function($) {
  'use strict';
  kintone.events.on('app.record.index.show', function(event) {
    var $header = $(kintone.app.getHeaderMenuSpaceElement());
    var $button = $('<button>')
      .addClass('kintoneplugin-button-normal')
      .text('Hello world!')
      .on('click', function(e) {{
        e.preventDefault();
        alert('Hello!');
      }});
    $header.append($button);
  });
}(jQuery));
