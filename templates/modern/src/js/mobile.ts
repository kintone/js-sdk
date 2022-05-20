// You can use the ESModules syntax and @kintone/rest-api-client without additional settings.
// import { KintoneRestAPIClient } from "@kintone/rest-api-client";

// @ts-expect-error
const PLUGIN_ID = kintone.$PLUGIN_ID;

kintone.events.on("mobile.app.record.index.show", () => {
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  const spaceElement = kintone.mobile.app.getHeaderSpaceElement();
  if (spaceElement === null) {
    throw new Error("The header element is unavailable on this page");
  }
  const fragment = document.createDocumentFragment();
  const headingEl = document.createElement("h3");
  const messageEl = document.createElement("p");

  messageEl.classList.add("plugin-space-message");
  messageEl.textContent = config.message;
  headingEl.classList.add("plugin-space-heading");
  headingEl.textContent = "Hello kintone plugin!";

  fragment.appendChild(headingEl);
  fragment.appendChild(messageEl);
  spaceElement.appendChild(fragment);
});
