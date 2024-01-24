(function (PLUGIN_ID) {
  kintone.events.on('app.record.index.show', () => {
    const spaceEl = kintone.app.getHeaderSpaceElement();
    if (spaceEl === null) {
      throw new Error('The header element is unavailable on this page.');
    }

    const fragment = document.createDocumentFragment();
    const headingEl = document.createElement('h3');
    const messageEl = document.createElement('p');

    const config = kintone.plugin.app.getConfig(PLUGIN_ID);
    messageEl.textContent = config.message;
    messageEl.classList.add('plugin-space-message');
    headingEl.textContent = 'Hello kintone plugin!';
    headingEl.classList.add('plugin-space-heading');

    fragment.appendChild(headingEl);
    fragment.appendChild(messageEl);
    spaceEl.appendChild(fragment);
  });
})(kintone.$PLUGIN_ID);
