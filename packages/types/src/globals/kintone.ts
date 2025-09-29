import type { General } from "./general.js";
import type { Events } from "./events.js";
import type { App, MobileApp } from "./app.js";
import type { Api } from "./api.js";
import type { Proxy } from "./proxy.js";
import type { MobilePortal, Portal } from "./portal.js";
import type { MobileSpace, Space } from "./space.js";
import type { Plugin } from "./plugin.js";

export type Kintone = General & {
  events: Events;
  app: App;
  api: Api;
  proxy: Proxy;
  portal: Portal;
  space: Space;
  plugin: Plugin;
  mobile: Mobile;
};

type Mobile = {
  app: MobileApp;
  portal: MobilePortal;
  space: MobileSpace;
};
