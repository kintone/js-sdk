(function (PLUGIN_ID) {
  const formEl = document.querySelector('.js-submit-settings');
  const cancelButtonEl = document.querySelector('.js-cancel-button');
  const messageEl = document.querySelector('.js-text-message');
  if (!(formEl && cancelButtonEl && messageEl)) {
    throw new Error('Required elements do not exist.');
  }

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (config.message) {
    messageEl.value = config.message;
  }

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    kintone.plugin.app.setConfig({ message: messageEl.value }, () => {
      alert('The plug-in settings have been saved. Please update the app!');
      window.location.href = '../../flow?app=' + kintone.app.getId();
    });
  });

  cancelButtonEl.addEventListener('click', () => {
    window.location.href = '../../' + kintone.app.getId() + '/plugin/';
  });
})(kintone.$PLUGIN_ID);
