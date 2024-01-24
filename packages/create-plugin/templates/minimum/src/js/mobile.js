(function (PLUGIN_ID) {
  "use strict";

  kintone.events.on("mobile.app.record.index.show", function () {
    let spaceEl = kintone.mobile.app.getHeaderSpaceElement();
    if (spaceEl === null) {
      throw new Error("The header element is unavailable on this page.");
    }

    let fragment = document.createDocumentFragment();
    let headingEl = document.createElement("h3");
    let messageEl = document.createElement("p");

    const config = kintone.plugin.app.getConfig(PLUGIN_ID);
    messageEl.textContent = config.message;
    messageEl.classList.add("plugin-space-message");
    headingEl.textContent = "Hello kintone plugin!";
    headingEl.classList.add("plugin-space-heading");

    fragment.appendChild(headingEl);
    fragment.appendChild(messageEl);
    spaceEl.appendChild(fragment);
  });
})(kintone.$PLUGIN_ID);
