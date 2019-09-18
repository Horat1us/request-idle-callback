import globalThis from "globalthis";
import { implementation, IdleHandler } from "./implementation";

export function polyfill(): IdleHandler {
    if (("function" === typeof globalThis.requestIdleCallback)
        && ("function" === typeof globalThis.cancelIdleCallback)) {
        return globalThis as IdleHandler;
    }
    return implementation;
}
export const { requestIdleCallback, cancelIdleCallback } = polyfill();
