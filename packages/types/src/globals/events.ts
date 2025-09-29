import { JSAPIEventTypes } from "../js-api/index.js";

export type Events = {
  on<EventType extends keyof JSAPIEventTypes>(
    type: EventType,
    handler: (event: JSAPIEventTypes[EventType]) => void,
  ): void | Promise<void>;
  off<EventType extends keyof JSAPIEventTypes>(
    type?: keyof JSAPIEventTypes | keyof JSAPIEventTypes[],
    handler?: (event: JSAPIEventTypes[EventType]) => void,
  ): boolean | Promise<boolean>;
};
